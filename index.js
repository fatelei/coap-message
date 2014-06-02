// main entry

var Message = require("./lib/message");
var generateMsgId = require('./lib/msgid').generateMsgId;

exports.generateMsgId = generateMsgId;
exports.Message = Message;
