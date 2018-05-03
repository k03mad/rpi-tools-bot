const {answer} = require('./chats');
const {knownDevices, myChat} = require('../../env');
const {MAC_RE} = require('./utils');
const {msg} = require('./messages');
const {sendToCorlysis} = require('./corlysis');
const c = require('require-all')(`${__dirname}/../cmd`);

/**
 *  Send sensor data and warn about high ppm
 */
const sendSensorsData = async () => {
    const data = await c.pi.sensors('onlyNum');

    if (Object.keys(data).length === 0) {
        console.log(msg.sensor.noData);
    } else {

        const send = [];

        for (const key in data) {
            send.push(`${key}=${data[key]}i`);
        }

        sendToCorlysis('sensors=weather', send.join()).catch(ex => console.log(msg.chart.cor(ex)));

    }
};

/**
 * Send connected devices and warn about unknown
 */
const sendConnectedWiFiDevices = async bot => {
    const places = {};

    for (const place of ['mad', 'knpl']) {
        const devices = await c.wifi.devices(place);

        if (devices !== msg.common.noDev && devices.includes('\n')) {
            places[place] = devices.split('\n\n');
        }
    }

    if (Object.keys(places).length > 0) {
        for (const place in places) {

            const known = Object.values(knownDevices).join();

            const data = [];
            const unknown = [];

            places[place].forEach((elem, index) => {
                if (!known.includes(elem.match(MAC_RE)[0])) {
                    unknown.push(elem);
                }

                for (const mac in knownDevices) {
                    // if device is not offline and from known list
                    if (!elem.split('\n').includes('-') && knownDevices[mac] === elem.match(MAC_RE)[0]) {
                        data.push(`${mac}=${index + 1}i`);
                    }
                }
            });

            // send unknown device warning
            if (unknown.length > 0) {
                answer(bot, {chat: {id: myChat}}, msg.cron.unknownDev(place, unknown.join('\n\n')));
            }

            // send online devices
            if (data.length > 0) {
                sendToCorlysis(`wifi=devices${place}`, data.join()).catch(ex => console.log(msg.chart.cor(ex)));
            }

        }
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
    checkRaspberryUpdates,
    sendConnectedWiFiDevices,
    sendSensorsData
};
