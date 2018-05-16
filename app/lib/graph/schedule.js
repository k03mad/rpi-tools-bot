const {answer} = require('../bot/chat');
const {knownDevices, myChat, lastfmToken} = require('../../../env');
const {MAC_RE, run, get} = require('../utils');
const {msg} = require('../messages');
const {promisify} = require('util');
const {sendToCorlysis} = require('./corlysis');
const c = require('require-all')(`${__dirname}/../../cmd`);
const fs = require('fs');
const sensors = require('./sensors');

const readFile = promisify(fs.readFile);

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
        return;
    }

    if (updates !== msg.common.updates) {
        answer(bot, {chat: {id: myChat}}, updates);
    }
};

/**
 * Send blocked queries by local dns
 */
const sendDnsQueries = async () => {
    let log;
    let parsedLog;

    try {
        log = await run('pihole -c -j');
        parsedLog = JSON.parse(log);
    } catch (err) {
        console.log(msg.cron.dns(log, err));
        return;
    }

    sendToCorlysis('dns=queries',
        `today=${parsedLog.dns_queries_today}i,blocked=${parsedLog.ads_blocked_today}i`
    ).catch(err => console.log(msg.chart.cor(err)));

};

/**
 * Send blocked hosts by local dns
 */
const sendDnsBlocks = async () => {
    const HOSTS_COUNT = 10;

    let pass;
    let parsed;

    try {
        const file = await readFile('/etc/pihole/setupVars.conf');
        [, pass] = file.toString().match(/WEBPASSWORD=(.+)\n/);
    } catch (err) {
        console.log(msg.cron.dnsVar(err));
        return;
    }

    try {
        const {body} = await get('http://localhost/admin/api.php', {
            query: {
                topItems: 25,
                auth: pass,
            },
            json: true,
        });
        parsed = body.top_ads;
    } catch (err) {
        console.log(msg.cron.dnsTop(err));
        return;
    }

    let i = 0;
    const data = [];

    for (const ad in parsed) {
        data.push(`${ad}=${parsed[ad]}i`);
        i++;

        if (i === HOSTS_COUNT) {
            break;
        }
    }

    if (data.length > 0) {
        sendToCorlysis('dns=top', data.join()).catch(err => console.log(msg.chart.cor(err)));
    }
};

/**
 * Send last fm plays count
 */
const sendLastFm = async () => {
    const users = ['k03mad', 'kanaplushka'];
    const data = [];

    await Promise.all(users.map(async elem => {
        try {
            const {body} = await get('http://ws.audioscrobbler.com/2.0/', {
                query: {
                    method: 'user.getinfo',
                    user: elem,
                    api_key: lastfmToken,
                    format: 'json',
                },
                json: true,
            });

            return data.push(`${body.user.name}=${body.user.playcount}i`);
        } catch (err) {
            console.log(msg.cron.lastfm(err));
        }
    }));

    if (data.length > 0) {
        sendToCorlysis('lastfm=plays', data.join()).catch(err => console.log(msg.chart.cor(err)));
    }
};

module.exports = {
    checkRaspberryUpdates,
    sendConnectedWiFiDevices,
    sendDnsBlocks,
    sendDnsQueries,
    sendLastFm,
    sendSensorsData,
};
