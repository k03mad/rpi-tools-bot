const {get, sendToInflux, convertUnit} = require('../../utils');
const {msg} = require('../../messages');

/**
 * Send Yahoo weather data
 */
const sendYahooData = async () => {
    let data;

    try {
        const {body} = await get('https://query.yahooapis.com/v1/public/yql', {
            body: {
                q: `
                    select wind.speed, atmosphere.humidity, atmosphere.pressure, item.condition.temp
                    from weather.forecast
                    where woeid = 2014899
                `,
                format: 'json',
            },
            form: true,
            json: true,
        });

        const {channel} = body.query.results;

        data = {
            temp: convertUnit('F', channel.item.condition.temp),
            press: convertUnit('hPa', channel.atmosphere.pressure),
            hum: channel.atmosphere.humidity,
            wind: convertUnit('mph', channel.wind.speed),
        };
    } catch (err) {
        console.log(msg.cron.yahoo(err));
    }

    sendToInflux('yahoo=weather', data);
};

module.exports = sendYahooData;
