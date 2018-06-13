const {get, router} = require('../../utils');
const {msg} = require('../../messages');
const {sendToInflux} = require('../../utils');
const cheerio = require('cheerio');

/**
 * Get traffic in/out from router
 * @param {String} place select router
 */
const getWanTraffic = async () => {

    const data = {};

    await Promise.all(['mad', 'knpl'].map(async place => {
        try {
            const host = `http://${router(place).ip}/cgi-bin/timepro.cgi`;

            const SELECTOR = '.menu_content_list_table tr';

            const {body} = await get(host, {
                auth: router(place).cred,
                query: {tmenu: 'trafficconf', smenu: 'linksetup'},
            });

            const $ = cheerio.load(body);
            const query = $(SELECTOR);

            query.each((i, elem) => {
                const text = $(elem).text();
                const textArr = text.split('\n').filter(x => Boolean(x));

                if (textArr[0] === 'Rx-Bytes') {
                    [, data[`in${place}`]] = textArr;
                } else if (textArr[0] === 'Tx-Bytes') {
                    [, data[`out${place}`]] = textArr;
                }
            });
        } catch (err) {
            console.log(msg.cron.traffic(err));
        }
    }));

    sendToInflux('wan=traffic', data);
};

module.exports = getWanTraffic;
