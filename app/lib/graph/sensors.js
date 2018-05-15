const {msg} = require('../messages');
const {run} = require('../utils');
const BME280 = require('bme-sensor-nolog');
const path = require('path');

/**
 * Get data from mhz19
 */
const getMhz19 = async () => {
    const pyFile = path.join(__dirname, 'ppm.py');
    console.log(pyFile);
    const ppm = Number(await run(`sudo python ${pyFile}`));

    if (ppm < 100 || ppm > 3000) {
        throw new Error(`wrong ppm count: ${ppm}`);
    }

    return {ppm};
};

/**
 * Get data from bme280
 */
const getBme280 = async () => {
    const bme280 = new BME280({i2cAddress: 0x76});
    await bme280.init();

    const data = await bme280.readSensorData();

    const temp = Math.round(data.temperature_C);

    if (temp < -50 || temp > 50) {
        throw new Error(`wrong temp count: ${temp}`);
    }

    const hum = Math.round(data.humidity);

    if (hum < 0 || hum > 100) {
        throw new Error(`wrong hum count: ${hum}`);
    }

    const press = Math.round(data.pressure_hPa * 0.75006375541921);

    if (press < 700 || press > 800) {
        throw new Error(`wrong press count: ${press}`);
    }

    return {temp, hum, press};
};

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
