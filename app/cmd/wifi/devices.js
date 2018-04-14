const {get, getMacVendor, router, MAC_RE} = require('../../lib/utils');
const {getCorlysisChartImage} = require('../../lib/corlysis');
const {msg} = require('../../lib/messages');
const cheerio = require('cheerio');

/**
 * Get device list from router
 */
const getDeviceList = async opts => {
    const host = `http://${router(opts).ip}`;
    const PATH = '/cgi-bin/timepro.cgi?tmenu=netconf&smenu=laninfo';

    const SELECTOR = '.menu_content_list_table tr';

    const {body} = await get(host + PATH, {
        auth: router(opts).cred,
        timeout: {
            connect: 2000,
            request: 3000,
            socket: 5000
        }
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
const prettyDeviceList = async (opts = {}) => {
    let list;

    try {
        list = await getDeviceList(opts);
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

    const answer = [output.length > 0 ? output.map(elem => elem.join('\n')).join('\n\n') : msg.common.noDev];

    if (!opts.noChart) {
        let chart;

        try {
            chart = await getCorlysisChartImage(opts.place === 'knpl' ? 3 : 2);
        } catch (ex) {
            chart = msg.chart.picErr(ex);
        }

        answer.push(chart);
    }

    return answer;
};

module.exports = prettyDeviceList;
