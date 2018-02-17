const {JSDOM} = require('jsdom');
const {get, getMacVendor} = require('../lib/utils');
const {wifiLogin, wifiPass, wifiIP} = require('../lib/env');

/**
 * Get device list from router
 */
const getDeviceList = async () => {
    const url = `http://${wifiIP}/cgi-bin/timepro.cgi?tmenu=netconf&smenu=laninfo`;
    const SELECTOR = '.menu_content_list_table tr';

    const {body} = await get(url, {
        auth: `${wifiLogin}:${wifiPass}`
    });

    const {window: {document}} = new JSDOM(body);
    const query = document.querySelectorAll(SELECTOR);

    return Array.from(query).map(elem => elem.textContent);
};

/**
 * Pretty device list and add mac vendor
 */
const prettyDeviceList = async () => {
    const MAC_RE = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    let list;

    try {
        list = await getDeviceList();
    } catch (ex) {
        return ex.toString();
    }

    const output = [];

    for (const data of list.map(elem => elem.split('\n'))) {
        const prepare = [];

        if (data[1] && !isNaN(Number(data[1]))) {

            for (const field of data) {
                if (isNaN(Number(field))) {

                    try {
                        if (MAC_RE.test(field)) {
                            const vendor = await getMacVendor(field);
                            prepare.push(vendor);
                        }
                    } catch (ex) {}

                    prepare.push(field);
                }
            }

            output.push(prepare);
        }
    }

    return output.map(elem => elem.join('\n')).join('\n\n');
};

module.exports = prettyDeviceList;
