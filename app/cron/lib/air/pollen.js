const {get, cutNumbers, sendToInflux} = require('../../../utils');
const {msg} = require('../../../messages');
const cheerio = require('cheerio');

/**
 * Send pollen index
 */
const sendPollen = async () => {
    const SELECTOR = '.main-data--stats-numbers';

    try {
        const {body} = await get('http://pollen.club');

        const $ = cheerio.load(body);
        const text = $(SELECTOR).text();
        const pollenIndex = cutNumbers(text);

        sendToInflux('air=pollen', {pollenIndex});
    } catch (err) {
        console.log(msg.cron.pollen(err));
    }
};

module.exports = sendPollen;
