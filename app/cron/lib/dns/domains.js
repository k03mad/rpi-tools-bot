const {run, sendToInflux} = require('../../../utils');
const {msg} = require('../../../messages');

/**
 * Send blocked domains count by local dns
 */
const sendDnsDomains = async () => {
    let log;

    await run('cd ../adblock-hosts-list && npm run deploy');
    await run('pihole -g');

    try {
        log = await run('pihole -c -j');

        const parsedLog = JSON.parse(log);
        sendToInflux('dns=domains', {domains: parsedLog.domains_being_blocked});
    } catch (err) {
        console.log(msg.cron.dnsDomains(log, err));
    }
};

module.exports = sendDnsDomains;
