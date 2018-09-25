const {printMsg} = require('./date');

module.exports = {
    /* eslint-disable key-spacing, no-multi-spaces */
    common: {
        emptyLog:                      printMsg('Log is empty'),
        updates:                       printMsg('No updates available'),
    },
    cron: {
        dns:        (log, ex)       => printMsg(`get dns queries:\n${ex}\nlog:\n${log}`),
        dnsClients: ex              => printMsg(`get pihole top clients:\n${ex}`),
        dnsTop:     ex              => printMsg(`get pihole top hosts:\n${ex}`),
        dnsVar:     ex              => printMsg(`get pihole password var:\n${ex}`),
        updErr:     ex              => printMsg(`get pi updates:\n${ex}`),
        usage:      ex              => printMsg(`get pi usage:\n${ex}`),
    },
    influx: {
        send:       (tag, data, ex) => printMsg(`sending "${tag}" with "${data}" to influx:\n${ex}`),
    },
    send: {
        norm:       ex              => printMsg(`sending normal message:\n${ex}`),
        photo:      ex              => printMsg(`sending photo message:\n${ex}`),
        typing:     ex              => printMsg(`sending typing message:\n${ex}`),
    },
};
