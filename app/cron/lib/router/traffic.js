const {get, router, sendToInflux} = require('../../../utils');
const {msg} = require('../../../messages');
const cheerio = require('cheerio');

const prevData = {};

/**
 * Filter strange bytes jump and generate data to send
 * @param {String[]} textArr scrapped fields from cheerio
 * @param {String} direction in/out
 * @param {String} place router place
 * @param {Object} sendData final object
 */
const generateData = (textArr, direction, place, sendData) => {
    const bytes = Number(textArr[1]);
    const tag = direction + place;

    if (!bytes) {
        return;
    }

    // send min value due to random strange bytes count increase
    sendData[tag] = prevData[tag] ? Math.min(bytes, prevData[tag]) : bytes;
    prevData[tag] = bytes;
};

/**
 * Get traffic in/out from router
 * @param {String} place select router
 */
const getWanTraffic = async () => {

    const sendData = {};

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

            query.each((_, elem) => {
                const text = $(elem).text();
                let textArr = text.split('\n');

                // one of the routers has additional tr element
                // remove first empty element from array
                if (!textArr[0]) {
                    textArr = textArr.splice(1, 2);
                }

                if (textArr[0] === 'Rx-Bytes') {
                    generateData(textArr, 'in', place, sendData);

                } else if (textArr[0] === 'Tx-Bytes') {
                    generateData(textArr, 'out', place, sendData);
                }
            });
        } catch (err) {
            console.log(msg.cron.traffic(err));
        }
    }));

    sendToInflux('router=traffic', sendData);
};

module.exports = getWanTraffic;
