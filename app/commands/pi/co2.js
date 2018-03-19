const {getChartImageCor} = require('../../lib/charts');
const {msg} = require('../../lib/messages');
const {run} = require('../../lib/utils');
const {thingSpeakChannel, corlysisPubToken} = require('../../lib/env');
const path = require('path');

/**
 * Return detailed message about ppm values
 */
const getDetailedMsg = ppm => {
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
};

/**
 * Get CO2 from mh_z19 with ppm.py
 */
const co2 = async onlyNum => {
    const pyFile = path.join(__dirname, '..', '..', 'py', 'ppm.py');
    const ppm = Number(await run(`sudo python ${pyFile}`));

    if (onlyNum) {
        return ppm;
    }

    const message = [
        `CO₂: *${ppm} ppm*`,
        getDetailedMsg(ppm),
        `Charts: [ThingSpeak](https://thingspeak.com/channels/${thingSpeakChannel}) [Grafana](https://corlysis.com/grafana/?token=${corlysisPubToken}) [Grafana (admin)](https://corlysis.com/grafana/dashboard/db/pi3-sensors)`
    ].join('\n\n');

    let chart;

    try {
        chart = await getChartImageCor();
    } catch (ex) {
        chart = msg.chart.picErr(ex);
    }

    return [message, chart];
};

module.exports = co2;
