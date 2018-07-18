const {get, sendToInflux, scrape} = require('../../../utils');
const {msg} = require('../../../messages');
const {probUrl, probSel, probUa, probName} = require('../../../env');

/**
 * Get traffic jam
 */
const getTrafficJam = async () => {
    try {
        const {body} = await get(probUrl, {headers: {'user-agent': probUa}});

        const scraped = scrape(body, probSel);
        const data = {traffic: scraped[0]};
        sendToInflux(`${probName}=jam`, data);
    } catch (err) {
        console.log(msg.cron.jam(err));
    }
};

module.exports = getTrafficJam;
