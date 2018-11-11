const msg = require('../../../errors');
const {pihole: {auth}} = require('../../../env');
const {request} = require('utils-mad');
const {sendToInflux, PIHOLE_URL} = require('../../../utils');

/**
 * Send dns top clients
 */
const sendClientsTop = async () => {
    const SEND_ITEMS = 30;

    let body;

    try {
        ({body} = await request.got(PIHOLE_URL, {
            query: {topClients: SEND_ITEMS, auth},
            json: true,
        }));

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
