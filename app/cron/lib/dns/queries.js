const {run, sendToInflux, nowWait} = require('../../../utils');
const msg = require('../../../errors');

/**
 * Send blocked queries by local dns
 */
const sendDnsQueries = async () => {
    let log;
    let parsedLog;
    let error;

    // sometimes pihole not returns values
    for (let i = 0; i < 3; i++) {
        try {
            log = await run('pihole -c -j');
            parsedLog = JSON.parse(log);
            break;
        } catch (err) {
            error = err;
        }

        await nowWait(2000);
    }

    error
        ? console.log(msg.cron.dns(log, error))
        : sendToInflux('dns=queries', {
            today: parsedLog.dns_queries_today,
            blocked: parsedLog.ads_blocked_today,
            domains: parsedLog.domains_being_blocked,
        });
};

module.exports = sendDnsQueries;
