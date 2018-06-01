const {lastfmToken} = require('../../env');
const {get, sendToCorlysis} = require('../../utils');
const {msg} = require('../../messages');

/**
 * Send last fm plays count
 */
const sendLastFm = async () => {
    const users = ['k03mad', 'kanaplushka'];
    const data = [];

    await Promise.all(users.map(async elem => {
        try {
            const {body} = await get('http://ws.audioscrobbler.com/2.0/', {
                query: {
                    method: 'user.getinfo',
                    user: elem,
                    api_key: lastfmToken,
                    format: 'json',
                },
                json: true,
            });

            return data.push(`${body.user.name}=${body.user.playcount}i`);
        } catch (err) {
            console.log(msg.cron.lastfm(err));
        }
    }));

    if (data.length > 0) {
        sendToCorlysis('lastfm=plays', data.join()).catch(err => console.log(msg.chart.cor(err)));
    }
};

module.exports = sendLastFm;
