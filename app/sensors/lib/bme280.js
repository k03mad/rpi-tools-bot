const BME280 = require('bme-sensor-nolog');
const {convertToMetric} = require('../../utils');

/**
 * Get data from bme280
 */
const getBme280 = async () => {
    const bme280 = new BME280({i2cAddress: 0x76});
    await bme280.init();

    const data = await bme280.readSensorData();

    const temp = data.temperature_C;

    if (temp < -50 || temp > 50) {
        throw new Error(`wrong temp count: ${temp}`);
    }

    const hum = data.humidity;

    if (hum < 0 || hum > 100) {
        throw new Error(`wrong hum count: ${hum}`);
    }

    const press = convertToMetric('hPa', data.pressure_hPa);

    if (press < 700 || press > 800) {
        throw new Error(`wrong press count: ${press}`);
    }

    return {temp, hum, press};
};

module.exports = getBme280;
