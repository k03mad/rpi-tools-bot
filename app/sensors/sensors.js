const {msg} = require('../messages');
const getMhz19 = require('./lib/mhz19');
const getBme280 = require('./lib/bme280');

/**
 * Get sensors data
 */
const sensors = async () => {
    const data = {};

    try {
        Object.assign(data, await getMhz19());
    } catch (err) {
        console.log(msg.sensor.mhz(err));
    }

    try {
        Object.assign(data, await getBme280());
    } catch (err) {
        console.log(msg.sensor.bme(err));
    }

    return data;
};

module.exports = sensors;
