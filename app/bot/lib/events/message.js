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
            const tag = `telegram=${mes.chat.id}`;
            const user = mes.from.username || mes.from.first_name;

            let lastCount;

            try {
                lastCount = await getFromInflux(tag, user);
            } catch (err) {
                console.log(msg.influx.get(tag, user));

                if (err.message === 'Cannot read property \'0\' of undefined') {
                    lastCount = 0;
                } else {
                    return;
                }
            }

            sendToInflux(tag, {[user]: ++lastCount});
        }
    });
};

module.exports = event;
