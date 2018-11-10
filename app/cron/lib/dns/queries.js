const {sendToInflux} = require('../../../utils');
const msg = require('../../../errors');
const {shell, promise} = require('utils-mad');

/**
 * Send blocked queries by local dns
 */
const sendDnsQueries = async () => {
    let error, log, parsedLog;

    // sometimes pihole doesn't return values
    for (let i = 0; i < 5; i++) {
        try {
            log = await shell.run('pihole -c -j');
            parsedLog = JSON.parse(log);

            if (parsedLog.domains_being_blocked > 0) {
                break;
            } else {
                throw new Error('Returned 0 domains in blacklist');
            }

        } catch (err) {
            error = err;
        }

        await promise.delay(5000);
    }

    error
        ? console.log(msg.cron.dns(log, error))
        : sendToInflux({tags: {dns: 'queries'}, values: parsedLog});
};

module.exports = sendDnsQueries;
