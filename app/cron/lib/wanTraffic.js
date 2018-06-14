const {get, router} = require('../../utils');
const {msg} = require('../../messages');
const {sendToInflux} = require('../../utils');
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
    // ~10 gb
    const TRAFFIC_JUMP_BYTES = 10000000000;

    const bytes = Number(textArr[1]);
    const tag = direction + place;
    const prevDataPoint = prevData[tag];

    // if no current value and previous value is saved before
    // send previous data point
    if (!bytes && prevDataPoint) {
        sendData[tag] = prevDataPoint;
        return;
    } else if (!bytes) {
        return;
    }

    // check for strange bytes jump
    // sometimes router returns increased bytes count by 12 figures
    const isJump = prevDataPoint
        ? bytes - prevDataPoint > TRAFFIC_JUMP_BYTES
        : false;

    sendData[tag] = !isJump || !prevDataPoint
        ? bytes
        : prevDataPoint;

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

    sendToInflux('wan=traffic', sendData);
};

module.exports = getWanTraffic;
