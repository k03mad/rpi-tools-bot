const {answer} = require('../../bot/lib/chat');
const {myChat} = require('../../env');
const {msg} = require('../../messages');
const getUpdate = require('../../bot/lib/commands/apt/update');

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

    if (updates !== msg.common.updates) {
        answer(bot, {chat: {id: myChat}}, updates);
    }
};

module.exports = checkRaspberryUpdates;
