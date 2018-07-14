const {run, sendToInflux} = require('../../../utils');
const {msg} = require('../../../messages');

/**
 * Send blocked domains count by local dns
 */
const sendDnsDomains = async () => {
    let log;

    try {
        log = await run('cd ../adblock-hosts-list && git pull && npm run setup && npm run deploy');
        log = await run('pihole -g');
        log = await run('pihole -c -j');

        const parsedLog = JSON.parse(log);
        sendToInflux('dns=domains', {domains: parsedLog.domains_being_blocked});
    } catch (err) {
        console.log(msg.cron.dnsDomains(log, err));
    }
};

module.exports = sendDnsDomains;
