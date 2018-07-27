const {get, sendToInflux, scrape} = require('../../../utils');
const {msg} = require('../../../messages');
const {prob, oldUa} = require('../../../env');

/**
 * Get traffic jam
 */
const getTrafficJam = async () => {
    try {
        const {body} = await get(prob.url, {headers: {'user-agent': oldUa}});

        const scraped = scrape(body, prob.sel);
        const data = {traffic: scraped[0]};
        sendToInflux(`${prob.name}=jam`, data);
    } catch (err) {
        console.log(msg.cron.jam(err));
    }
};

module.exports = getTrafficJam;
