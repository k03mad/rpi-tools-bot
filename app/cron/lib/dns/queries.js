const {run, sendToInflux, nowWait} = require('../../../utils');
const msg = require('../../../errors');

/**
 * Send blocked queries by local dns
 */
const sendDnsQueries = async () => {
    let blocked, domains, error, log, parsedLog, today;

    // sometimes pihole doesn't return values
    for (let i = 0; i < 3; i++) {
        try {
            log = await run('pihole -c -j');
            parsedLog = JSON.parse(log);

            domains = parsedLog.domains_being_blocked;
            today = parsedLog.dns_queries_today;
            blocked = parsedLog.ads_blocked_today;

            if (domains > 0) {
                break;
            } else {
                throw new Error('Returned 0 domains in blacklist');
            }

        } catch (err) {
            error = err;
        }

        await nowWait(3000);
    }

    error
        ? console.log(msg.cron.dns(log, error))
        : sendToInflux('dns=queries', {today, blocked, domains});
};

module.exports = sendDnsQueries;
