const {run, sendToInflux} = require('../../utils');
const {msg} = require('../../messages');

/**
 * Send blocked queries by local dns
 */
const sendDnsQueries = async () => {
    let log;
    let data;

    try {
        log = await run('pihole -c -j');

        const parsedLog = JSON.parse(log);
        data = `today=${parsedLog.dns_queries_today}i,blocked=${parsedLog.ads_blocked_today}i`;
    } catch (err) {
        console.log(msg.cron.dns(log, err));
        return;
    }

    const TAG = 'dns=queries';
    sendToInflux(TAG, data).catch(err => console.log(msg.common.influx(TAG, err)));
};

module.exports = sendDnsQueries;
