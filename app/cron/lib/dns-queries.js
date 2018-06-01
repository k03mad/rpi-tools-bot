const {run, sendToCorlysis} = require('../../utils');
const {msg} = require('../../messages');

/**
 * Send blocked queries by local dns
 */
const sendDnsQueries = async () => {
    let log;
    let parsedLog;

    try {
        log = await run('pihole -c -j');
        parsedLog = JSON.parse(log);
    } catch (err) {
        console.log(msg.cron.dns(log, err));
        return;
    }

    const DB = 'dns=queries';

    sendToCorlysis(
        DB, `today=${parsedLog.dns_queries_today}i,blocked=${parsedLog.ads_blocked_today}i`
    ).catch(err => console.log(msg.chart.cor(DB, err)));
};

module.exports = sendDnsQueries;
