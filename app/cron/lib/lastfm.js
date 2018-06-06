const {lastfmToken, lastfmUserMad, lastfmUserKnpl} = require('../../env');
const {get, sendToInflux} = require('../../utils');
const {msg} = require('../../messages');

/**
 * Send last fm top artists
 */
const sendLastFm = async () => {
    const users = [lastfmUserMad, lastfmUserKnpl];
    const data = {};

    await Promise.all(users.map(async user => {
        try {
            const {body} = await get('http://ws.audioscrobbler.com/2.0/', {
                query: {
                    api_key: lastfmToken,
                    format: 'json',
                    limit: 10,
                    method: 'user.gettopartists',
                    period: '1month',
                    user,
                },
                json: true,
            });

            data[user] = {};

            body.topartists.artist.forEach(artist => {
                data[user][artist.name.replace(' ', '\\ ')] = artist.playcount;
            });
        } catch (err) {
            console.log(msg.cron.lastfm(err));
        }
    }));

    users.forEach(user => {
        if (Object.keys(data[user]).length > 0) {
            const tag = `lastfm=topartist${user}`;
            sendToInflux(tag, data[user]).catch(err => console.log(msg.common.influx(tag, err)));
        }
    });
};

module.exports = sendLastFm;
