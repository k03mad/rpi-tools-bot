const {getChartImageCor} = require('../../lib/charts');
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

    const message = [`CO₂: *${ppm} ppm*`];

    switch (true) {
        case ppm > 1400:
            message.push(msg.co2.high);
            break;
        case ppm > 1000:
            message.push(msg.co2.aboveMed);
            break;
        case ppm > 800:
            message.push(msg.co2.medium);
            break;
        case ppm > 600:
            message.push(msg.co2.belowMed);
            break;
        case ppm > 300:
            message.push(msg.co2.low);
            break;

        default:
            message.push(msg.co2.err);
    }

    message.push([
        'Charts:',
        'https://thingspeak.com/channels/452758',
        'https://corlysis.com/grafana/?token=ac9af9d1-8f34-49ac-926f-3b8ba0bed959'
    ].join('\n'));

    return [message.join('\n\n'), await getChartImageCor()];
};

co2().then(console.log);

module.exports = co2;
