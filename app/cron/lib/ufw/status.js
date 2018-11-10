const {answer} = require('../../../bot/lib/chat');
const {chat} = require('../../../env');
const {shell} = require('utils-mad');

/**
 * Get UFW status
 * @param {Object} bot telegram node api
 */
const ufwStatus = async bot => {
    const status = await shell.run('sudo ufw status');

    if (!status.includes('.')) {
        answer(bot, {chat: {id: chat}}, `UFW is inactive!\n\n${status}`);
    }
};

module.exports = ufwStatus;
