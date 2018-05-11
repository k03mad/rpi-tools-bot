const {msg} = require('../../lib/messages');
const {run} = require('../../lib/utils');
const BME280 = require('bme-sensor-nolog');
const path = require('path');

/**
 * Return value level
 */
const getLevel = (value, type) => {
    switch (type) {
        case 'temp':
            switch (true) {
                case value > 24:
                    return 'high';
                case value > 20:
                    return 'normal';
                case value > 0:
                    return 'low';

                default:
                    return msg.sensor.err(type);
            }

        case 'hum':
            switch (true) {
                case value > 60:
                    return 'high';
                case value > 40:
                    return 'normal';
                case value > 0:
                    return 'low';

                default:
                    return msg.sensor.err(type);
            }

        case 'press':
            switch (true) {
                case value > 760:
                    return 'high';
                case value > 750:
                    return 'normal';
                case value > 0:
                    return 'low';

                default:
                    return msg.sensor.err(type);
            }

        case 'co2':
            switch (true) {
                case value > 1400:
                    return 'dangerous';
                case value > 1000:
                    return 'high';
                case value > 800:
                    return 'above normal';
                case value > 600:
                    return 'slightly above normal';
                case value > 300:
                    return 'normal';

                default:
                    return msg.sensor.err(type);
            }

        default:
            return msg.common.level(type);
    }
};

/**
 * Get data from mhz19
 */
const getMhz19 = async () => {
    const pyFile = path.join(__dirname, '..', '..', 'lib', 'ppm.py');
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
const sensors = async onlyNum => {
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

    if (onlyNum) {
        return data;
    }

    const message = [];

    if (data.temp) {
        message.push(`Temp: *${data.temp}°C* (${getLevel(data.temp, 'temp')})`);
    }

    if (data.hum) {
        message.push(`Humidity: *${data.hum}%* (${getLevel(data.hum, 'hum')})`);
    }

    if (data.press) {
        message.push(`Pressure: *${data.press} mmHg* (${getLevel(data.press, 'press')})`);
    }

    if (data.ppm) {
        message.push(`CO₂: *${data.ppm} ppm* (${getLevel(data.ppm, 'co2')})`);
    }

    return message.join('\n');
};

module.exports = sensors;
