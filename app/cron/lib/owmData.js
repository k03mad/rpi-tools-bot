const {get, sendToInflux, convertToMm} = require('../../utils');
const {msg} = require('../../messages');
const {owmCityId, owmToken} = require('../../env');

/**
 * Send openweathermap data
 */
const sendOwmData = async () => {
    let data;

    try {
        const {body} = await get('http://api.openweathermap.org/data/2.5/weather', {
            query: {
                appid: owmToken,
                id: owmCityId,
                units: 'metric',
            },
            json: true,
        });

        data = {
            temp: body.main.temp,
            press: convertToMm(body.main.pressure),
            hum: body.main.humidity,
            wind: body.wind.speed,
        };
    } catch (err) {
        console.log(msg.cron.owm(err));
    }

    const TAG = 'owm=weather';
    sendToInflux(TAG, data);
};

module.exports = sendOwmData;
