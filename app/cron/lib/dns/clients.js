const {pihole: {auth}} = require('../../../env');
const {request, sendToInflux, PIHOLE_URL} = require('../../../utils');
const msg = require('../../../errors');

/**
 * Send dns top clients
 */
const sendClientsTop = async () => {
    const SEND_ITEMS = 30;

    let body;

    try {
        ({body} = await request()
            .get(PIHOLE_URL)
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

    sendToInflux({tags: {dns: 'topClients'}, values: top});
};

module.exports = sendClientsTop;
