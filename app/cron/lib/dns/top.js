const {request, getPiHoleApiPass, sendToInflux} = require('../../../utils');
const {msg} = require('../../../messages');
const {piholeUrl} = require('../../../env');

let auth;

/**
 * Send dns top hosts
 */
const sendDnsTop = async () => {
    const SEND_ITEMS = 20;

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
        ({body} = await request()
            .get(piholeUrl)
            .query({topItems: SEND_ITEMS, auth}));

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
