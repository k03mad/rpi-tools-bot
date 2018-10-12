const {run, sendToInflux, nowWait} = require('../../../utils');
const msg = require('../../../errors');

/**
 * Send blocked queries by local dns
 */
const sendDnsQueries = async () => {
    let error, log, parsedLog;

    // sometimes pihole doesn't return values
    for (let i = 0; i < 5; i++) {
        try {
            log = await run('pihole -c -j');
            parsedLog = JSON.parse(log);

            if (parsedLog.domains_being_blocked > 0) {
                break;
            } else {
                throw new Error('Returned 0 domains in blacklist');
            }

        } catch (err) {
            error = err;
        }

        await nowWait(5000);
    }

    error
        ? console.log(msg.cron.dns(log, error))
        : sendToInflux('dns=queries', parsedLog);
};

module.exports = sendDnsQueries;
