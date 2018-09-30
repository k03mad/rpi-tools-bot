const {answer} = require('../../../bot/lib/chat');
const {chat} = require('../../../env');
const {run} = require('../../../utils');

/**
 * Get UFW status
 * @param {Object} bot telegram node api
 */
const ufwStatus = async bot => {
    const status = await run('sudo ufw status');

    if (!status.includes('tun0')) {
        answer(bot, {chat: {id: chat}}, 'UFW is inactive!');
    }
};

module.exports = ufwStatus;
