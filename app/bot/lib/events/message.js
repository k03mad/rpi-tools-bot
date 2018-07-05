const {sendToInflux, getFromInflux} = require('../../../utils');
const {msg} = require('../../../messages');
const {myGroup} = require('../../../env');

/**
 * on message event
 * @param {Object} bot telegram node api
 */
const event = bot => {
    bot.on('message', async mes => {
        if (mes.chat.id === myGroup) {
            const TAG = 'telegram=family';
            const user = mes.from.username;

            let lastCount;

            try {
                lastCount = await getFromInflux(TAG, user);
            } catch (err) {
                console.log(msg.influx.get(TAG, user));

                if (err.message === 'Cannot read property \'0\' of undefined') {
                    lastCount = 0;
                } else {
                    return;
                }
            }

            sendToInflux(TAG, {[user]: ++lastCount});
        }
    });
};

module.exports = event;
