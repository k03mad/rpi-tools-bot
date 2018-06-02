const {lastfmToken} = require('../../env');
const {get, sendToInflux} = require('../../utils');
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
        const TAG = 'lastfm=topartist';
        sendToInflux(TAG, data.join()).catch(err => console.log(msg.common.influx(TAG, err)));
    }
};

module.exports = sendLastFm;
