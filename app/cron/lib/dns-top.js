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
        const DB = 'dns=topBlock';
        sendToCorlysis(DB, ads.join()).catch(err => console.log(msg.chart.cor(DB, err)));
    }

    if (queries.length > 0) {
        const DB = 'dns=topQueries';
        sendToCorlysis(DB, queries.join()).catch(err => console.log(msg.chart.cor(DB, err)));
    }
};

module.exports = sendDnsTop;
