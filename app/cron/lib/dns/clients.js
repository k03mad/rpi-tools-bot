const {request, getPiHoleApiPass, sendToInflux} = require('../../../utils');
const {msg} = require('../../../messages');
const {piholeUrl} = require('../../../env');

let auth;

/**
 * Send dns top clients
 */
const sendClientsTop = async () => {
    const SEND_ITEMS = 20;

    if (!auth) {
        try {
            auth = await getPiHoleApiPass();
        } catch (err) {
            console.log(msg.cron.dnsVar(err));
            return;
        }
    }

    let body;

    try {
        ({body} = await request()
            .get(piholeUrl)
            .query({topClients: SEND_ITEMS, auth}));

    } catch (err) {
        console.log(msg.cron.dnsClients(err));
        return;
    }

    const top = {};

    const topClients = Object.keys(body.top_sources);

    for (let i = 0; i < SEND_ITEMS; i++) {
        const client = topClients[i];

        if (client) {
            top[client] = body.top_sources[client];
        }
    }

    sendToInflux('dns=topClients', top);
};

module.exports = sendClientsTop;
