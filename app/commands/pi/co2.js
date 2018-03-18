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

    const defStr = `CO₂: *${ppm} ppm*\n\n`;

    switch (true) {
        case ppm > 1400:
            return defStr + msg.co2.high;
        case ppm > 1000:
            return defStr + msg.co2.aboveMed;
        case ppm > 800:
            return defStr + msg.co2.medium;
        case ppm > 600:
            return defStr + msg.co2.belowMed;
        case ppm > 300:
            return defStr + msg.co2.low;

        default:
            return defStr + msg.co2.err;
    }

};

module.exports = co2;
