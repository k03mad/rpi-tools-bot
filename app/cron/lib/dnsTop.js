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

    const ads = [];
    const queries = [];

    const [topAds, topQueries] = [Object.keys(body.top_ads), Object.keys(body.top_queries)];

    for (let i = 0; i < 10; i++) {
        ads.push(`${topAds[i]}=${body.top_ads[topAds[i]]}i`);
        queries.push(`${topQueries[i]}=${body.top_queries[topQueries[i]]}i`);
    }

    if (ads.length > 0) {
        const TAG = 'dns=topBlock';
        sendToInflux(TAG, ads.join()).catch(err => console.log(msg.common.influx(TAG, err)));
    }

    if (queries.length > 0) {
        const TAG = 'dns=topQueries';
        sendToInflux(TAG, queries.join()).catch(err => console.log(msg.common.influx(TAG, err)));
    }
};

module.exports = sendDnsTop;
