const {get, getPiHoleApiPass, sendToCorlysis} = require('../../utils');
const {msg} = require('../../messages');

/**
 * Send dns top hosts
 */
const sendDnsTop = async () => {
    let auth;

    try {
        auth = await getPiHoleApiPass();
    } catch (err) {
        console.log(msg.cron.dnsVar(err));
        return;
    }

    let body;

    try {
        ({body} = await get('http://localhost/admin/api.php', {
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
        sendToCorlysis('dns=topBlock', ads.join()).catch(err => console.log(msg.chart.cor(err)));
    }

    if (queries.length > 0) {
        sendToCorlysis('dns=topQueries', queries.join()).catch(err => console.log(msg.chart.cor(err)));
    }
};

module.exports = sendDnsTop;
