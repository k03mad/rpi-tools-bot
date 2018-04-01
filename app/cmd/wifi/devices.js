const {get, getMacVendor} = require('../../lib/utils');
const {wifiLogin, wifiPass, wifiIP} = require('../../lib/env');
const cheerio = require('cheerio');

/**
 * Get device list from router
 */
const getDeviceList = async () => {
    const url = `http://${wifiIP}/cgi-bin/timepro.cgi?tmenu=netconf&smenu=laninfo`;
    const SELECTOR = '.menu_content_list_table tr';

    const {body} = await get(url, {auth: `${wifiLogin}:${wifiPass}`});

    const $ = cheerio.load(body);

    const output = [];
    const query = $(SELECTOR);

    query.each((i, elem) => output.push($(elem).text()));

    return output;
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
                    prepare.push(field);
                }
            }

            output.push(prepare);
        }
    }

    await Promise.all(output.map(async elem => {
        const [, mac] = elem;

        try {
            if (MAC_RE.test(mac)) {
                elem[1] = `${mac}\n${await getMacVendor(mac)}`;
            }
        } catch (ex) {}
    }));

    return output.map(elem => elem.join('\n')).join('\n\n');
};

module.exports = prettyDeviceList;
