const {answer} = require('../../../bot/lib/chat');
const {msg} = require('../../../messages');
const {my} = require('../../../env');
const {sendToInflux, checkTimer} = require('../../../utils');
const moment = require('moment');
const sensors = require('../../../sensors/sensors');

let ppmTimer = moment();

/**
 * Send sensor data and warn about high ppm
 * @param {Object} bot telegram node api
 */
const sendSensorsData = async bot => {
    // send warning if ppm above this count
    const PPM_WARNING = 1000;

    const data = await sensors();

    sendToInflux('sensors=weather', data);

    // send warning every REPEAT_ALARM minutes until ppm drop
    if (Object.keys(data).length > 0 && data.ppm > PPM_WARNING && checkTimer(ppmTimer)) {
        answer(bot, {chat: {id: my.chat}}, msg.sensor.warning(data.ppm));
        ppmTimer = moment();
    }

};

module.exports = sendSensorsData;
