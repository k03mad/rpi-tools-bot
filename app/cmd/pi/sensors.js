const {getCorlysisChartImage} = require('../../lib/corlysis');
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
    return {ppm: Number(await run(`sudo python ${pyFile}`))};
};

/**
 * Get data from bme280
 */
const getBme280 = async () => {
    const bme280 = new BME280({i2cAddress: 0x76});
    await bme280.init();

    const data = await bme280.readSensorData();

    const newData = {
        temp: Math.round(data.temperature_C),
        hum: Math.round(data.humidity),
        press: Math.round(data.pressure_hPa * 0.75006375541921)
    };

    return newData;
};

/**
 * Get sensors data
 */
const sensors = async onlyNum => {
    const data = {};

    try {
        Object.assign(data, await getMhz19());
    } catch (ex) {
        console.log(msg.sensor.mhz(ex));
    }

    try {
        Object.assign(data, await getBme280());
    } catch (ex) {
        console.log(msg.sensor.bme(ex));
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

    const output = [message.join('\n')];

    await Promise.all([1, 4, 5].map(async elem => {
        try {
            output.push(await getCorlysisChartImage(elem));
        } catch (ex) {
            output.push(msg.chart.picErr(ex));
        }
    }));

    return output;
};

module.exports = sensors;
