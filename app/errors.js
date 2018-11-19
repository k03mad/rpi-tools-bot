const {printMsg} = require('./date');

module.exports = {
    /* eslint-disable key-spacing, no-multi-spaces */
    cron: {
        dns:        (log, ex)          => printMsg(`get dns queries:\n${ex}\nlog:\n${[log]}`),
        dnsClients: ex                 => printMsg(`get pihole top clients:\n${ex}`),
        dnsTop:     ex                 => printMsg(`get pihole top hosts:\n${ex}`),
        updErr:     ex                 => printMsg(`get pi updates:\n${ex}`),
        usage:      ex                 => printMsg(`get pi usage:\n${ex}`),
    },
    influx: {
        send:       ex                 => printMsg(ex),
    },
    send: {
        norm:       ex                 => printMsg(`sending normal message:\n${ex}`),
        typing:     ex                 => printMsg(`sending typing message:\n${ex}`),
    },
};
