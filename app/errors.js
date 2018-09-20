/**
 * Get current date
 */
const currentDate = () => `[${(new Date()).toString().replace(' GMT+0300 (GMT+03:00)', '')}]`;

module.exports = {
    /* eslint-disable key-spacing, no-multi-spaces */
    common: {
        emptyLog:                      'Log is empty',
        updates:                       'No updates available',
    },
    cron: {
        dns:        (log, ex)       => `${currentDate()} get dns queries: ${ex}, log: ${log}`,
        dnsClients: ex              => `${currentDate()} get pihole top clients: ${ex}`,
        dnsTop:     ex              => `${currentDate()} get pihole top hosts: ${ex}`,
        dnsVar:     ex              => `${currentDate()} get pihole password var: ${ex}`,
        updErr:     ex              => `${currentDate()} get pi updates: ${ex}`,
        usage:      ex              => `${currentDate()} get pi usage: ${ex}`,
    },
    influx: {
        send:       (tag, data, ex) => `${currentDate()} sending "${tag}" with "${data}" to influx: ${ex}`,
    },
    send: {
        norm:       ex              => `${currentDate()} sending normal message: ${ex}`,
        photo:      ex              => `${currentDate()} sending photo message: ${ex}`,
        typing:     ex              => `${currentDate()} sending typing message: ${ex}`,
    },
};
