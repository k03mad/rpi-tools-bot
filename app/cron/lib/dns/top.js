const msg = require('../../../errors');
const {pihole: {auth}} = require('../../../env');
const {request} = require('utils-mad');
const {sendToInflux, PIHOLE_URL} = require('../../../utils');

/**
 * Send dns top hosts
 */
const sendDnsTop = async () => {
    const SEND_ITEMS = 30;

    let body;

    try {
        ({body} = await request.got(PIHOLE_URL, {
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

    sendToInflux({tags: {dns: 'topBlock'}, values: ads});
    sendToInflux({tags: {dns: 'topQueries'}, values: queries});
};

module.exports = sendDnsTop;
