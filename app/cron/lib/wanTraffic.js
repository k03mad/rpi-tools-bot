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
                let textArr = text.split('\n');

                // one of routers has additional tr element
                // remove first empty element from array
                if (!textArr[0]) {
                    textArr = textArr.splice(1, 2);
                }

                if (textArr[0] === 'Rx-Bytes') {
                    const bytes = Number(textArr[1]);

                    if (bytes) {
                        data[`in${place}`] = bytes;
                    }
                } else if (textArr[0] === 'Tx-Bytes') {
                    const bytes = Number(textArr[1]);

                    if (bytes) {
                        data[`out${place}`] = bytes;
                    }
                }
            });
        } catch (err) {
            console.log(msg.cron.traffic(err));
        }
    }));

    sendToInflux('wan=traffic', data);
};

module.exports = getWanTraffic;
