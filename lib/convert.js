/*
 * data format convert
 */


var msgid = require('./msgid');


/*
 * generate a empty message
 */
exports.empty = function(type) {
  var packet = {
    ack: false,
    confirm: false,
    reset: false,
    unconfirm: false,
    messageId: null,
    token: null,
    options: [],
    payload: null,
    code: '0.00'
  };

  packet[type] = true;
  packet.token = new Buffer(0);
  packet.payload = new Buffer(0);
  packet.messageId = msgid.generateMsgId()();

  return packet;
};