const {get, sendToInflux, cutNumbers} = require('../../../utils');
const {msg} = require('../../../messages');
const cheerio = require('cheerio');

/**
 * Get moscow traffic jam
 */
const getTrafficJam = async () => {
    const HOST = 'https://yandex.ru';
    const SELECTOR = 'i.b-ico.traffic__icon.b-ico-traffic-gn';

    try {
        const {body} = await get(HOST);

        const $ = cheerio.load(body);
        const query = $(SELECTOR);

        const data = {traffic: cutNumbers(query['0'].next.data)};
        sendToInflux('yandex=jam', data);
    } catch (err) {
        console.log(msg.cron.jam(err));
    }
};

module.exports = getTrafficJam;
