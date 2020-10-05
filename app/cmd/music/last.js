'use strict';

const {music, spotify} = require('../../../env');
const {parse, request, shell} = require('utils-mad');

/** @returns {Promise<string>} */
module.exports = async () => {
    const TRACKS_NUM = 10;

    const body = await shell.run(`curl ${music.playlist}`);

    const tracks = [];
    const texts = parse.text({body, selector: '.d-track__artists, .d-track__title'});

    for (let i = 0; i < texts.length; i += 2) {
        tracks.push({artist: texts[i + 1], song: texts[i]});
    }

    const auth = await request.cache('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${
                Buffer.from(`${spotify.id}:${spotify.secret}`).toString('base64')
            }`,
        },
        form: {
            grant_type: 'client_credentials',
        },
    }, {expire: '1h'});

    const output = await Promise.all(tracks.slice(0, TRACKS_NUM).map(async track => {
        const search = await request.got('https://api.spotify.com/v1/search', {
            headers: {
                Authorization: `${auth.body.token_type} ${auth.body.access_token}`,
            },
            searchParams: {
                q: `${track.artist} ${track.song}`,
                type: 'track',
                limit: 1,
            },
        });

        const [item] = search.body.tracks.items;
        return item
            ? `${track.artist} - ${track.song}\n${item.external_urls.spotify}`
            : `${track.artist} - ${track.song}\nnot found`;
    }));

    return {
        message: output.join('\n\n'),
        opts: {disable_web_page_preview: true},
    };
};
