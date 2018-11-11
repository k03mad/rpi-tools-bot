const getUpdate = require('../../../bot/cmd/apt/update');
const msg = require('../../../errors');
const {answer} = require('../../../bot/lib/chat');
const {chat} = require('../../../env');

/**
 * Check system updates with apt-get update
 * @param {Object} bot telegram node api
 */
const checkRaspberryUpdates = async bot => {
    let updates;

    try {
        updates = await getUpdate();
    } catch (err) {
        console.log(msg.cron.updErr(err));
        return;
    }

    if (updates.includes('\n')) {
        answer(bot, {chat: {id: chat}}, updates);
    }
};

module.exports = checkRaspberryUpdates;
