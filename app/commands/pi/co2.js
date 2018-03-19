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

    const chartLink = [
        'Charts:',
        'https://thingspeak.com/channels/452758',
        'https://corlysis.com/grafana/?token=ac9af9d1-8f34-49ac-926f-3b8ba0bed959'
    ].join('\n');

    const ppmString = `CO₂: *${ppm} ppm*`;

    /**
     * Generate full message with explanation and chart link
     */
    const fullMsg = explain => [ppmString, explain, chartLink].join('\n\n');

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
