const {run, sendToInflux} = require('../../../utils');
const {msg} = require('../../../messages');

/**
 * Send blocked queries by local dns
 */
const sendDnsQueries = async () => {
    let log;

    try {
        log = await run('pihole -c -j');

        const parsedLog = JSON.parse(log);
        sendToInflux('dns=queries', {
            today: parsedLog.dns_queries_today,
            blocked: parsedLog.ads_blocked_today,
        });
    } catch (err) {
        console.log(msg.cron.dns(log, err));
    }
};

module.exports = sendDnsQueries;
