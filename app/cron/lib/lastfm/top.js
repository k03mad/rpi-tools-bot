const {lastfm} = require('../../../env');
const {sendToInflux} = require('../../../utils');
const {msg} = require('../../../errors');
const {request} = require('utils-mad');

const data = [
    {
        method: 'user.getTopAlbums',
        obj: 'topalbums',
        child: 'album',
        main: 'name',
        extra: ['artist', 'name'],
    },
    {
        method: 'user.getTopArtists',
        obj: 'topartists',
        child: 'artist',
        main: 'name',
    },
    {
        method: 'user.getTopTracks',
        obj: 'toptracks',
        child: 'track',
        main: 'name',
        extra: ['artist', 'name'],
    },
];

/**
 * Send last fm top artists
 */
const sendLastFm = async () => {
    await Promise.all(lastfm.users.map(async user => {
        await Promise.all(data.map(async elem => {
            try {
                const output = {};

                const {body} = await request.got('http://ws.audioscrobbler.com/2.0/', {
                    query: {
                        api_key: lastfm.token,
                        format: 'json',
                        limit: 10,
                        method: elem.method,
                        period: '3month',
                        user,
                    },
                    json: true,
                });

                body[elem.obj][elem.child].forEach(res => {
                    let name;

                    if (elem.extra) {
                        name = [
                            res[elem.extra[0]][elem.extra[1]],
                            res[elem.main],
                        ].join(' - ').replace(/([ ,])/g, '\\$1');
                    } else {
                        name = res[elem.main].replace(/([ ,])/g, '\\$1');
                    }

                    output[name] = Number(res.playcount);
                });

                sendToInflux({db: 'lastfm', tags: {[`${user}lastfm`]: elem.obj}, values: output});
            } catch (err) {
                console.log(user, elem.method, msg.cron.lastfm(err));
            }
        }));
    }));
};

module.exports = sendLastFm;
