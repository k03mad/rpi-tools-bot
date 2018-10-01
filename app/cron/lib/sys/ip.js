const {answer} = require('../../../bot/lib/chat');
const {chat} = require('../../../env');
const {wanIp} = require('../../../env');
const {run} = require('../../../utils');

/**
 * Check WAN IP changed
 * @param {Object} bot telegram node api
 */
const ipChanged = async bot => {
    const ip = await run('dig +short myip.opendns.com @resolver1.opendns.com');

    if (ip.trim() !== wanIp) {
        answer(bot, {chat: {id: chat}}, `WAN IP is changed:\n${wanIp} => ${ip}`);
    }
};

module.exports = ipChanged;
