const {answer} = require('./chats');
const {knownDevices, myChat} = require('../../env');
const {MAC_RE, run} = require('./utils');
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

        sendToCorlysis('sensors=weather', send.join()).catch(err => console.log(msg.chart.cor(err)));

    }
};

/**
 * Send connected devices and warn about unknown
 */
const sendConnectedWiFiDevices = async bot => {
    const places = {};

    await Promise.all(['mad', 'knpl'].map(async place => {
        const devices = await c.wifi.devices(place);

        if (devices !== msg.common.noDev) {
            devices.includes('\n')
                ? places[place] = devices.split('\n\n')
                : console.log(msg.common.errDev(place, devices));
        }
    }));

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
                sendToCorlysis(`wifi=devices${place}`, data.join()).catch(err => console.log(msg.chart.cor(err)));
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
    } catch (err) {
        console.log(msg.cron.updErr(err));
    }

    if (updates && updates !== msg.common.updates) {
        answer(bot, {chat: {id: myChat}}, updates);
    }
};

/**
 * Send blocked queries by local dns
 */
const sendDnsQueries = async () => {
    let log;

    try {
        log = JSON.parse(await run('pihole -c -j'));
    } catch (err) {
        console.log(msg.cron.dns(err));
    }

    const queries = log.dns_queries_today;
    const blocked = log.ads_blocked_today;

    if (log && queries && blocked) {
        sendToCorlysis('dns=queries', `today=${queries}i,blocked=${blocked}i`).catch(err => console.log(msg.chart.cor(err)));
    }
};

module.exports = {
    checkRaspberryUpdates,
    sendConnectedWiFiDevices,
    sendDnsQueries,
    sendSensorsData,
};
