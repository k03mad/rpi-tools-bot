const {get, sendToInflux, convertToMetric} = require('../../utils');
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
                    select atmosphere.humidity, item.condition.temp
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
            temp: convertToMetric('F', channel.item.condition.temp),
            hum: channel.atmosphere.humidity,
        };
    } catch (err) {
        console.log(msg.cron.yahoo(err));
    }

    sendToInflux('yahoo=weather', data);
};

module.exports = sendYahooData;
