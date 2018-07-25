const {get, sendToInflux} = require('../../../utils');
const {msg} = require('../../../messages');
const {aqi} = require('../../../env');

/**
 * Send air quality index
 */
const sendAirQuality = async () => {
    try {
        const {body} = await get(`https://api.waqi.info/feed/geo:${aqi.lat};${aqi.lon}/`, {
            query: {token: aqi.token},
            json: true,
        });

        sendToInflux('air=quality', {aqi: body.data.aqi});
    } catch (err) {
        console.log(msg.cron.aqi(err));
    }
};

module.exports = sendAirQuality;
