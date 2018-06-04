const {answer} = require('../../bot/lib/chat');
const {msg} = require('../../messages');
const {myChat} = require('../../env');
const {sendToInflux, checkTimer} = require('../../utils');
const moment = require('moment');
const sensors = require('../../sensors/sensors');

let ppmTimer = moment();

/**
 *  Send sensor data and warn about high ppm
 */
const sendSensorsData = async bot => {
    // send warning if ppm above this count
    const PPM_WARNING = 1000;

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

        // send warning every REPEAT_ALARM minutes until ppm drop
        if (data.ppm > PPM_WARNING && checkTimer(ppmTimer)) {
            answer(bot, {chat: {id: myChat}}, msg.sensor.warning(data.ppm));
            ppmTimer = moment();
        }

    }
};

module.exports = sendSensorsData;
