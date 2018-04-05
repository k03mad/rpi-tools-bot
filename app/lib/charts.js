const {get} = require('./utils');
const {corlysisToken, corlysisPubToken} = require('./env');

/**
 * Send data to corlysis
 */
const sendToCorlysis = (field, data) => {
    return get('https://corlysis.com:8086/write', {
        query: {
            db: 'pi'
        },
        body: `pi3,${field} ${data}`,
        auth: `token:${corlysisToken}`
    });
};

/**
 * Get chart image from corlysis
 */
const getCO2ChartImage = async () => {
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
    getCO2ChartImage,
    sendToCorlysis
};
