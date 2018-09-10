const {run, sendToInflux, nowWait} = require('../../../utils');
const {msg} = require('../../../messages');
const dnsUpdate = require('../../../bot/lib/commands/dns/update');

/**
 * Send blocked domains count by local dns
 */
const sendDnsDomains = async () => {
    let log;
    let domains;

    try {
        await dnsUpdate();

        for (let i = 0; i < 30; i++) {
            log = await run('pihole -c -j');
            const parsedLog = JSON.parse(log);
            domains = parsedLog.domains_being_blocked;

            if (domains > 0) {
                break;
            }

            await nowWait(1000);
        }

        sendToInflux('dns=domains', {domains});
    } catch (err) {
        console.log(msg.cron.dnsDomains(log, err));
    }
};

module.exports = sendDnsDomains;
