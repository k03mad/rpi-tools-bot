const {thingSpeakToken, corlysisToken} = require('./env');
const {get} = require('./utils');

/**
 * Send ppm to thingspeak
 */
const sendCo2ChartTS = ppm => {
    return get('https://api.thingspeak.com/update', {
        query: {
            api_key: thingSpeakToken,
            field1: ppm
        }
    });
};

/**
 * Send ppm to corlysis
 */
const sendCo2ChartCor = ppm => {
    return get('https://corlysis.com:8086/write?db=pi', {
        body: `pi3,sensor=co2 ppm=${ppm}`,
        auth: `token:${corlysisToken}`
    });
};

module.exports = {
    sendCo2ChartCor,
    sendCo2ChartTS
};
