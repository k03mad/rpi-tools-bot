const {get, sendToInflux, scrape} = require('../../../utils');
const {msg} = require('../../../messages');
const {oldUa, rfplUrl} = require('../../../env');
const {cutNumbers} = require('../../../utils');

/**
 * Get rfpl table
 */
const getRfplTable = async () => {
    try {
        const {body} = await get(rfplUrl, {headers: {'user-agent': oldUa}});

        const club = scrape(body, 'td.club p')
            .map(elem => elem.replace(' ', '\\ '));
        const place = scrape(body, 'td.place')
            .map(elem => cutNumbers(elem))
            .filter(Boolean);

        const data = {};
        club.forEach((key, i) => {
            data[key] = place[i];
        });

        sendToInflux('rfpl=table', data);
    } catch (err) {
        console.log(msg.cron.rfpl(err));
    }
};

module.exports = getRfplTable;
