const {get, sendToInflux} = require('../../../utils');
const {msg} = require('../../../messages');
const cheerio = require('cheerio');

/**
 * Get moscow traffic jam
 */
const getTrafficJam = async () => {
    const HOST = 'https://yandex.ru';
    const SELECTOR = '#traffic .num';

    try {
        const {body} = await get(HOST, {headers: {'user-agent': 'NetFront/3.3'}});

        const $ = cheerio.load(body);
        const query = $(SELECTOR);

        const data = {traffic: query.text()};
        sendToInflux('yandex=jam', data);
    } catch (err) {
        console.log(msg.cron.jam(err));
    }
};

module.exports = getTrafficJam;
