const {request, router, scrape, MAC_RE} = require('../../../../utils');
const {msg} = require('../../../../messages');
const oui = require('oui');

/**
 * Get connected devices list from router
 * @param {String} place select router
 */
const getDeviceList = async place => {
    const host = `http://${router(place).ip}/cgi-bin/timepro.cgi`;

    const SELECTOR = '.menu_content_list_table tr';

    const {body} = await request()
        .get(host)
        .auth(router(place).cred)
        .query({tmenu: 'netconf', smenu: 'laninfo'});

    return scrape(body, SELECTOR);
};

/**
 * Prettify device list
 * @param {String} place select router
 */
const prettyDeviceList = async place => {
    let list;

    try {
        list = await getDeviceList(place);
    } catch (err) {
        return err.toString();
    }

    const output = [];

    for (const data of list.map(elem => elem.split('\n'))) {
        const prepare = [];

        if (data[1] && !isNaN(Number(data[1]))) {

            for (const field of data) {
                if (isNaN(Number(field))) {
                    prepare.push(field);
                }
            }

            output.push(prepare);
        }
    }

    output.forEach(elem => {
        const [, mac] = elem;

        try {
            if (new RegExp(`^${MAC_RE.source}$`).test(mac)) {
                elem[1] = `${mac}\n${oui(mac).split('\n')[0]}`;
            }
        } catch (err) {
            console.log(msg.common.vendor(mac, err));
        }
    });

    return output.length > 0 ? output.map(elem => elem.join('\n')).join('\n\n') : msg.common.noDev;
};

module.exports = prettyDeviceList;
