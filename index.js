// main entry

var Message = require('./lib/message');
var generateMsgId = require('./lib/msgid').generateMsgId;
var IncomeMessage = reuqire('./lib/in');
var OutcomeMessage = require('./lib/out');

exports.generateMsgId = generateMsgId;
exports.Message = Message;
exports.IncomeMessage = IncomeMessage;
exports.OutcomeMessage = OutcomeMessage;
