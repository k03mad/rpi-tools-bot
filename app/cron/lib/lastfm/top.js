const {lastfm} = require('../../../env');
const {get, sendToInflux} = require('../../../utils');
const {msg} = require('../../../messages');

/**
 * Send last fm top artists
 */
const sendLastFm = async () => {
    const users = [lastfm.user.mad, lastfm.user.knpl];
    const data = {};

    await Promise.all(users.map(async user => {
        try {
            const {body} = await get('http://ws.audioscrobbler.com/2.0/', {
                query: {
                    api_key: lastfm.token,
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
                const artistName = artist.name
                    .replace(/ ?, ?/g, ' & ')
                    .replace(/ /g, '\\ ');
                data[user][artistName] = artist.playcount;
            });
        } catch (err) {
            console.log(msg.cron.lastfm(err));
        }
    }));

    users.forEach(user => sendToInflux(`lastfm=topartist${user}`, data[user]));
};

module.exports = sendLastFm;
