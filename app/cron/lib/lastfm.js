const {lastfmToken} = require('../../env');
const {get, sendToCorlysis} = require('../../utils');
const {msg} = require('../../messages');

/**
 * Send last fm top artists
 */
const sendLastFm = async () => {
    const data = [];

    try {
        const {body} = await get('http://ws.audioscrobbler.com/2.0/', {
            query: {
                api_key: lastfmToken,
                format: 'json',
                limit: 10,
                method: 'user.gettopartists',
                period: '1month',
                user: 'k03mad',
            },
            json: true,
        });

        body.topartists.artist.forEach(artist => {
            data.push(`${artist.name}=${artist.playcount}i`);
        });
    } catch (err) {
        console.log(msg.cron.lastfm(err));
    }

    if (data.length > 0) {
        const DB = 'lastfm=topartist';
        sendToCorlysis(DB, data.join()).catch(err => console.log(msg.chart.cor(DB, err)));
    }
};

module.exports = sendLastFm;
