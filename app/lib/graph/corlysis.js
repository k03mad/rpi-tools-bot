const {get} = require('../utils');
const {corlysisToken, corlysisPubToken} = require('../../../env');

/**
 * Send data to corlysis
 */
const sendToCorlysis = (field, data) => {
    return get('https://corlysis.com:8086/write', {
        query: {
            db: 'mydb',
        },
        body: `pi3,${field} ${data}`,
        auth: `token:${corlysisToken}`,
    });
};

/**
 * Get chart image from corlysis
 */
const getCorlysisChartImage = async panelId => {
    const {body} = await get('https://corlysis.com/grafana/render/dashboard-solo/db/pi3', {
        encoding: null,
        query: {
            panelId,
            refresh: '30s',
            orgId: '821',
            width: '1200',
            height: '400',
            tz: 'UTC+03:00',
        },
        headers: {
            cookie: `token=${corlysisPubToken}`,
        },
    });

    return Buffer.from(body);
};

module.exports = {
    getCorlysisChartImage,
    sendToCorlysis,
};
