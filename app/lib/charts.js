const {get} = require('./utils');
const {thingSpeakToken, corlysisToken, corlysisPubToken} = require('./env');

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
    return get('https://corlysis.com:8086/write', {
        query: {
            db: 'pi'
        },
        body: `pi3,sensor=co2 ppm=${ppm}`,
        auth: `token:${corlysisToken}`
    });
};

/**
 * Remove old data from corlysis due to free plan
 */
const removeOldDataCor = () => {
    return get('https://corlysis.com:8086/query', {
        query: {
            db: 'pi',
            q: 'delete from "pi3" where time < now()-13d'
        },
        auth: `token:${corlysisToken}`
    });
};

/**
 * Get chart image from corlysis
 */
const getChartImageCor = async () => {
    const {body} = await get('https://corlysis.com/grafana/render/dashboard-solo/db/pi3-sensors', {
        encoding: null,
        query: {
            refresh: '30s',
            orgId: '821',
            panelId: '1',
            width: '1000',
            height: '400',
            tz: 'UTC+03:00'
        },
        headers: {
            cookie: `token=${corlysisPubToken}`
        }
    });

    return Buffer.from(body);
};

module.exports = {
    getChartImageCor,
    removeOldDataCor,
    sendCo2ChartCor,
    sendCo2ChartTS
};
