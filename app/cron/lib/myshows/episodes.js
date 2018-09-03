const {request, sendToInflux} = require('../../../utils');
const {msg} = require('../../../messages');
const {myShows} = require('../../../env');

/**
 * Send Myshows.me episodes left count
 */
const sendMyshowsData = async () => {
    /* eslint-disable camelcase */
    let access_token;
    let token_type;
    let remainingEpisodes;

    try {
        const {body} = await request()
            .post('https://myshows.me/oauth/token')
            .send(myShows);

        ({access_token, token_type} = body);
    } catch (err) {
        console.log(msg.cron.msToken(err));
        return;
    }

    try {
        const {body} = await request()
            .post('https://api.myshows.me/v2/rpc/')
            .auth(token_type, access_token)
            .send({
                id: 1,
                jsonrpc: '2.0',
                method: 'profile.Get',
                params: {login: myShows.username},
            });

        ({remainingEpisodes} = body.result.stats);
    } catch (err) {
        console.log(msg.cron.msStats(err));
    }

    sendToInflux('myshows=stats', {remainingEpisodes});
};

module.exports = sendMyshowsData;
