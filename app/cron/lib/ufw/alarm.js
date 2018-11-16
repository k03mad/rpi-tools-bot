const getLog = require('../../../bot/cmd/ufw/log');
const {answer} = require('../../../bot/lib/chat');
const {chat} = require('../../../env');

/**
 * Alarm if too much blocked request
 * @param {Object} bot telegram node api
 */
const alarmUfwLog = async bot => {
    const log = await getLog();

    if (/\d: /.test(log)) {
        answer(bot, {chat: {id: chat}}, log, {markdown: true});
    }
};

module.exports = alarmUfwLog;
