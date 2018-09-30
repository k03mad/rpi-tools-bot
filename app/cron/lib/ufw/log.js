const {answer} = require('../../../bot/lib/chat');
const {chat} = require('../../../env');
const getLog = require('../../../bot/cmd/ufw/log');

/**
 * Check UFW block log
 * @param {Object} bot telegram node api
 */
const checkUfwLog = async bot => {
    const log = await getLog();

    if (log.includes('.')) {
        answer(bot, {chat: {id: chat}}, log, 'markdown');
    }
};

module.exports = checkUfwLog;
