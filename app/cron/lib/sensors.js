const {msg} = require('../../messages');
const {sendToInflux} = require('../../utils');
const sensors = require('../../sensors/sensors');

/**
 *  Send sensor data and warn about high ppm
 */
const sendSensorsData = async () => {
    const data = await sensors();

    if (Object.keys(data).length === 0) {
        console.log(msg.sensor.noData);
    } else {

        const send = [];

        for (const key in data) {
            send.push(`${key}=${data[key]}i`);
        }

        const TAG = 'sensors=weather';
        sendToInflux(TAG, send.join()).catch(err => console.log(msg.common.influx(TAG, err)));

    }
};

module.exports = sendSensorsData;
