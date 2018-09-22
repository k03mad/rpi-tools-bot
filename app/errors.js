const date = (new Date()).toString().replace(' GMT+0300 (GMT+03:00)', '');

/**
 * GPrint message with datestamp
 */
const printMsg = msg => `[${date}]\n${msg}\n`;

module.exports = {
    /* eslint-disable key-spacing, no-multi-spaces */
    common: {
        emptyLog:                      'Log is empty',
        updates:                       'No updates available',
    },
    cron: {
        dns:        (log, ex)       => printMsg(`get dns queries: ${ex}, log: ${log}`),
        dnsClients: ex              => printMsg(`get pihole top clients: ${ex}`),
        dnsTop:     ex              => printMsg(`get pihole top hosts: ${ex}`),
        dnsVar:     ex              => printMsg(`get pihole password var: ${ex}`),
        updErr:     ex              => printMsg(`get pi updates: ${ex}`),
        usage:      ex              => printMsg(`get pi usage: ${ex}`),
    },
    influx: {
        send:       (tag, data, ex) => printMsg(`sending "${tag}" with "${data}" to influx: ${ex}`),
    },
    send: {
        norm:       ex              => printMsg(`sending normal message: ${ex}`),
        photo:      ex              => printMsg(`sending photo message: ${ex}`),
        typing:     ex              => printMsg(`sending typing message: ${ex}`),
    },
};
