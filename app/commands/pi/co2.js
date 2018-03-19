const {msg} = require('../../lib/messages');
const {run} = require('../../lib/utils');
const path = require('path');

/**
 * Get CO2 from mh_z19 with ppm.py
 */
const co2 = async onlyNum => {
    const pyFile = path.join(__dirname, '..', '..', 'py', 'ppm.py');
    const ppm = Number(await run(`sudo python ${pyFile}`));

    if (onlyNum) {
        return ppm;
    }

    const CHART_LINK = 'Chart: https://thingspeak.com/channels/452758';
    const ppmString = `CO₂: *${ppm} ppm*`;

    /**
     * Generate full message with explanation and chart link
     */
    const fullMsg = explain => [ppmString, explain, CHART_LINK].join('\n\n');

    switch (true) {
        case ppm > 1400:
            return fullMsg(msg.co2.high);
        case ppm > 1000:
            return fullMsg(msg.co2.aboveMed);
        case ppm > 800:
            return fullMsg(msg.co2.medium);
        case ppm > 600:
            return fullMsg(msg.co2.belowMed);
        case ppm > 300:
            return fullMsg(msg.co2.low);

        default:
            return fullMsg(msg.co2.err);
    }

};

module.exports = co2;
