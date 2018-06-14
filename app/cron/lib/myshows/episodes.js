const {get, sendToInflux} = require('../../../utils');
const {msg} = require('../../../messages');
const {myShowsClientId, myShowsClientSecret, myShowsUserName, myShowsPassword} = require('../../../env');

/**
 * Send Myshows.me episodes left count
 */
const sendMyshowsData = async () => {
    /* eslint-disable camelcase */
    let access_token;
    let token_type;
    let remainingEpisodes;

    try {
        const {body} = await get('https://myshows.me/oauth/token', {
            body: {
                grant_type: 'password',
                client_id: myShowsClientId,
                client_secret: myShowsClientSecret,
                username: myShowsUserName,
                password: myShowsPassword,
            },
            json: true,
        });

        ({access_token, token_type} = body);
    } catch (err) {
        console.log(msg.cron.msToken(err));
        return;
    }

    try {
        const {body} = await get('https://api.myshows.me/v2/rpc/', {
            Authorization: [token_type, access_token].join(' '),
            body: {
                id: 1,
                jsonrpc: '2.0',
                method: 'profile.Get',
                params: {login: myShowsUserName},
            },
            json: true,
        });

        ({remainingEpisodes} = body.result.stats);
    } catch (err) {
        console.log(msg.cron.msStats(err));
    }

    sendToInflux('myshows=stats', {remainingEpisodes});
};

module.exports = sendMyshowsData;
