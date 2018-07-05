const {sendToInflux} = require('../../../utils');
const {msg} = require('../../../messages');

/**
 * on polling_error event
 * @param {Object} bot telegram node api
 */
const event = bot => {
    bot.on('polling_error', ex => {
        console.log(msg.common.polling(ex));
        sendToInflux('bot=polling', {pollErr: 1});
    });
};

module.exports = event;
