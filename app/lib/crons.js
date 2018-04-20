const {answer} = require('./chats');
const {knownDevices, myChat} = require('../../env');
const {MAC_RE} = require('./utils');
const {msg} = require('./messages');
const {sendToCorlysis} = require('./corlysis');
const c = require('require-all')(`${__dirname}/../cmd`);
const moment = require('moment');
const slugify = require('slugify');

const PPM_WARNING = 1000;
const PPM_REPEAT_ALARM = {time: 30, unit: 'minutes'};

let ppmTimer = moment().subtract(PPM_REPEAT_ALARM.time, PPM_REPEAT_ALARM.unit);

/**
 *  Send sensor data and warn about high ppm
 */
const sendSensorsData = async bot => {
    const data = await c.pi.sensors('onlyNum');

    if (Object.keys(data).length === 0) {
        console.log(msg.sensor.noData);
    } else {

        const send = [];

        for (const key in data) {
            send.push(`${key}=${data[key]}i`);
        }

        sendToCorlysis('sensors=weather', send.join()).catch(ex => msg.chart.cor(ex));

        // send warning every REPEAT_ALARM minutes until ppm drop
        if (data.ppm > PPM_WARNING && moment().diff(ppmTimer, PPM_REPEAT_ALARM.unit) > PPM_REPEAT_ALARM.time) {
            answer(bot, {chat: {id: myChat}}, msg.sensor.warning(data.ppm));
            ppmTimer = moment();
        }

    }
};

/**
 * Send connected devices and warn about unknown
 */
const sendConnectedWiFiDevices = async bot => {
    const places = {};

    for (const opts of [{noChart: true}, {noChart: true, place: 'knpl'}]) {
        const key = opts.place || 'home';
        const devices = await c.wifi.devices(opts);

        Array.isArray(devices)
            ? places[key] = devices[0].split('\n\n')
            : console.log(msg.cron.devErr(key, devices));
    }

    if (Object.keys(places).length > 0) {
        for (const place in places) {

            const known = Object.values(knownDevices).join();

            const data = [];
            const unknown = [];

            places[place].forEach((elem, index) => {
                if (elem !== msg.common.noDev) {
                    if (!known.includes(elem.match(MAC_RE)[0])) {
                        unknown.push(elem);
                    }

                    for (const mac in knownDevices) {
                        // if device is not offline and from known list
                        if (!elem.split('\n').includes('-') && knownDevices[mac] === elem.match(MAC_RE)[0]) {
                            data.push(`${mac}=${index + 1}i`);
                        }
                    }
                }
            });

            // send unknown device warning
            if (unknown.length > 0) {
                answer(bot, {chat: {id: myChat}}, msg.cron.unknownDev(place, unknown.join('\n\n')));
            }

            // send online devices
            if (data.length > 0) {
                sendToCorlysis(`wifi=devices${place}`, data.join()).catch(ex => msg.chart.cor(ex));
            }

        }
    }
};

/**
 * Send WiFi spots list
 */
const sendWiFiSpotsList = async () => {
    let spots = [];

    try {
        spots = await c.wifi.spots({noVendor: true, noChart: true});
        spots = spots.split('\n\n').map(elem => elem.split('\n'));
    } catch (ex) {
        console.log(msg.cron.spotErr(ex));
    }

    const data = [];
    spots.forEach(elem => {
        const [, spot] = elem[0].match(/\*(.+)\*/);
        const [, value] = elem[0].match(/\((\d+)%\)/);
        data.push(`${slugify(spot)}=${value}i`);
    });

    if (data.length > 0) {
        sendToCorlysis('wifi=spots', data.join()).catch(ex => msg.chart.cor(ex));
    }
};

/**
 * Check system updates with apt-get update
 */
const checkRaspberryUpdates = async bot => {
    let updates;

    try {
        updates = await c.apt.update();
    } catch (ex) {
        console.log(msg.cron.updErr(ex));
    }

    if (updates && updates !== msg.common.updates) {
        answer(bot, {chat: {id: myChat}}, updates);
    }
};

module.exports = {
    sendSensorsData,
    sendConnectedWiFiDevices,
    sendWiFiSpotsList,
    checkRaspberryUpdates
};
