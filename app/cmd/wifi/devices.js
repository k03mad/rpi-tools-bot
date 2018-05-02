const {get, getMacVendor, router, MAC_RE} = require('../../lib/utils');
const {msg} = require('../../lib/messages');
const cheerio = require('cheerio');

/**
 * Get device list from router
 */
const getDeviceList = async place => {
    const host = `http://${router(place).ip}`;
    const PATH = '/cgi-bin/timepro.cgi?tmenu=netconf&smenu=laninfo';

    const SELECTOR = '.menu_content_list_table tr';

    const {body} = await get(host + PATH, {
        auth: router(place).cred
    });

    const $ = cheerio.load(body);
    const query = $(SELECTOR);

    const output = [];
    query.each((i, elem) => output.push($(elem).text()));

    return output;
};

/**
 * Pretty device list and add mac vendor
 */
const prettyDeviceList = async place => {
    let list;

    try {
        list = await getDeviceList(place);
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
            if (new RegExp(`^${MAC_RE.source}$`).test(mac)) {
                elem[1] = `${mac}\n${await getMacVendor(mac)}`;
            }
        } catch (ex) {}
    }));

    return output.length > 0 ? output.map(elem => elem.join('\n')).join('\n\n') : msg.common.noDev;
};

module.exports = prettyDeviceList;
