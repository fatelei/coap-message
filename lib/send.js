/*
 * coap send module
 * charge of retransit
 */

var util = require("util");
var events = require("events");
var params = require("./parameters");


function Sender(socket, port, host) {
  this.socket = socket;
  this.port = port;
  this.host = host;

  this.counter = 0;
  this.inteval = params.ackTimeout * (1 + (params.ackRandomFactor - 1) * Math.random());

  this.backOffTimer = null;

  // backoff retransmit
  var self = this;
  this.exponentially = function() {
    self.inteval *= 2;
    self._write(); 
  };

  events.EventEmitter.call(this); 
}

util.inherits(Sender, events.EventEmitter);
module.exports = Sender;

/*
 * clean timer schedule
 */
Sender.prototype.clearTimer = function() {
  var self = this;

  self.counter = 0;
  self.inteval = params.ackTimeout * (1 + (params.ackRandomFactor - 1) * Math.random());
  clearTimeout(self.exchangeTimer);
  clearTimeout(self.backOffTimer);
};

/* 
 * send data
 * when message is ack, reset, 
 */
Sender.prototype._write = function() {
  var self = this;

  if (self.packet !== undefined) {
    self.socket.send(self.packet, 0, self.packet.length, self.port, self.host, function (err, bytes) {
      if (err) {
        // dns error
        self.emit("error", err, self.port, self.host);
      } else {
        self.emit("sent", self.port, self.host);
      }
    });

    if (self.isBackOff) {
      if (++self.counter < params.maxRetransmit) {
        self.backOffTimer = setTimeout(self.exponentially, self.inteval);
      }
    }
  }
};

/*
 * 
 */
Sender.prototype.send = function(packet, isBackOff) {
  var self = this;

  self.packet = packet;
  self.isBackOff = isBackOff;
  
  self._write();

  if (isBackOff) {
    self.exchangeTimer = setTimeout(function () {
      var err = new Error('No reply in ' + params.exchangeLifetime + 's')
      self.emit("dead", err, self);
    }, params.exchangeLifetime);
  }
};
