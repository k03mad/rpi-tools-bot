const {get, sendToInflux, scrape} = require('../../../utils');
const {msg} = require('../../../messages');

/**
 * Get moscow traffic jam
 */
const getTrafficJam = async () => {
    const HOST = 'https://yandex.ru';
    const SELECTOR = '#traffic .num';

    try {
        const {body} = await get(HOST, {headers: {'user-agent': 'NetFront/3.3'}});

        const scraped = scrape(body, SELECTOR);
        const data = {traffic: scraped[0]};
        sendToInflux('yandex=jam', data);
    } catch (err) {
        console.log(msg.cron.jam(err));
    }
};

module.exports = getTrafficJam;
