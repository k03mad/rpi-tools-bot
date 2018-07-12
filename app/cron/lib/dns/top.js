const {get, getPiHoleApiPass, sendToInflux} = require('../../../utils');
const {msg} = require('../../../messages');
const {piholeUrl} = require('../../../env');

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

    const SEND_ITEMS = 10;
    let body;

    try {
        ({body} = await get(piholeUrl, {
            query: {topItems: SEND_ITEMS, auth},
            json: true,
        }));
    } catch (err) {
        console.log(msg.cron.dnsTop(err));
        return;
    }

    const ads = {};
    const queries = {};

    const [topAds, topQueries] = [Object.keys(body.top_ads), Object.keys(body.top_queries)];

    for (let i = 0; i < SEND_ITEMS; i++) {
        const adElem = topAds[i];
        const queElem = topQueries[i];

        if (adElem) {
            ads[adElem] = body.top_ads[adElem];
        }

        if (queElem) {
            queries[queElem] = body.top_queries[queElem];
        }
    }

    sendToInflux('dns=topBlock', ads);
    sendToInflux('dns=topQueries', queries);
};

module.exports = sendDnsTop;
