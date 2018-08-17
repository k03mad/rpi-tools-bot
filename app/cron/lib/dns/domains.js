const {run, sendToInflux, nowWait} = require('../../../utils');
const {msg} = require('../../../messages');
const dnsUpdate = require('../../../bot/lib/commands/dns/update');

/**
 * Send blocked domains count by local dns
 */
const sendDnsDomains = async () => {
    let log;

    try {
        await dnsUpdate();
        await nowWait(10000);

        log = await run('pihole -c -j');

        const parsedLog = JSON.parse(log);
        sendToInflux('dns=domains', {domains: parsedLog.domains_being_blocked});
    } catch (err) {
        console.log(msg.cron.dnsDomains(log, err));
    }
};

module.exports = sendDnsDomains;
