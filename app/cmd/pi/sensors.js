const {getCorlysisChartImage} = require('../../lib/charts');
const {msg} = require('../../lib/messages');
const {run} = require('../../lib/utils');
const path = require('path');

/**
 * Return detailed message about sensor values
 */
const getDetailedMsg = (ppm, type) => {
    if (type === 'co2') {
        switch (true) {
            case ppm > 1400:
                return msg.co2.high;
            case ppm > 1000:
                return msg.co2.aboveMed;
            case ppm > 800:
                return msg.co2.medium;
            case ppm > 600:
                return msg.co2.belowMed;
            case ppm > 300:
                return msg.co2.low;

            default:
                return msg.co2.err;
        }
    }
};

/**
 * Get sensors data with python
 */
const sensors = async onlyNum => {
    const pyFile = path.join(__dirname, '..', '..', 'py', 'ppm.py');
    const ppm = Number(await run(`sudo python ${pyFile}`));

    if (onlyNum) {
        return {ppm};
    }

    const message = [
        `CO₂: *${ppm} ppm* (${getDetailedMsg(ppm, 'co2')})`
    ].join('\n');

    let chart;

    try {
        chart = await getCorlysisChartImage(1);
    } catch (ex) {
        chart = msg.chart.picErr(ex);
    }

    return [message, chart];
};

module.exports = sensors;
