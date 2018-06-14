const {get, getPiHoleApiPass, sendToInflux} = require('../../utils');
const {msg} = require('../../messages');
const {piholeUrl} = require('../../env');

let auth;

/**
 * Send dns top hosts
 */
const sendDnsTop = async () => {
    if (!auth) {
        try {
            auth = await getPiHoleApiPass();
        } catch (err) {
            console.log(msg.cron.dnsVar(err));
            return;
        }
    }

    let body;

    try {
        ({body} = await get(piholeUrl, {
            query: {topItems: 10, auth},
            json: true,
        }));
    } catch (err) {
        console.log(msg.cron.dnsTop(err));
        return;
    }

    const ads = {};
    const queries = {};

    const [topAds, topQueries] = [Object.keys(body.top_ads), Object.keys(body.top_queries)];

    for (let i = 0; i < 10; i++) {
        ads[topAds[i]] = body.top_ads[topAds[i]];
        queries[topQueries[i]] = body.top_queries[topQueries[i]];
    }

    sendToInflux('dns=topBlock', ads);
    sendToInflux('dns=topQueries', queries);
};

module.exports = sendDnsTop;
