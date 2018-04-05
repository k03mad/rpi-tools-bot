const {every} = require('schedule');
const {MAC_RE} = require('./lib/utils');
const {msg} = require('./lib/messages');
const {knownDevices, myChat} = require('./lib/env');
const {sendText} = require('./lib/senders');
const {sendToCorlysis} = require('./lib/charts');
const c = require('require-all')(`${__dirname}/cmd`);
const moment = require('moment');

/**
 * Bot crons
 */
const cron = bot => {

    const PPM_WARNING = 1000;
    const PPM_REPEAT_ALARM = 30;

    let ppmTimer = moment().subtract(PPM_REPEAT_ALARM, 'minutes');

    // check raspberry updates at startup
    (async () => {
        const updates = await c.apt.update();

        if (updates !== msg.common.updates) {
            sendText(bot, {chat: {id: myChat}}, updates);
        }
    })();

    // send data to charts
    every('1m').do(async () => {
        let ppm;

        try {
            ({ppm} = await c.pi.sensors('num'));
        } catch (ex) {
            console.log(msg.chart.err(ex));
        }

        if (ppm) {
            sendToCorlysis('sensor=co2', `ppm=${ppm}`).catch(ex => msg.chart.cor(ex));

            // send warning every REPEAT_ALARM minutes until ppm drop
            if (ppm > PPM_WARNING && moment().diff(ppmTimer, 'minutes') > PPM_REPEAT_ALARM) {
                sendText(bot, {chat: {id: myChat}}, msg.co2.warning(ppm));
                ppmTimer = moment();
            }
        }
    });

    // check devices connected to the router
    // every('5m').do(async () => {
    (async () => {
        let devices;

        try {
            devices = (await c.wifi.devices()).split('\n\n');
        } catch (ex) {
            console.log(msg.common.devErr(ex));
        }

        if (devices) {
            const known = Object.values(knownDevices).join();

            const data = [];
            const unknown = [];

            devices.forEach((elem, index) => {
                if (!known.includes(elem.match(MAC_RE)[0])) {
                    unknown.push(elem);
                }

                for (const mac in knownDevices) {
                    // if device is not offline and from known list
                    if (!elem.split('\n').includes('-') && knownDevices[mac] === elem.match(MAC_RE)[0]) {
                        data.push(`${mac}=${index + 1}`);
                    }
                }
            });

            // send unknown device warning
            if (unknown.length > 0) {
                sendText(bot, {chat: {id: myChat}}, msg.common.unknownDev(unknown.join('\n\n')));
            }

            // send online devices
            if (data.length > 0) {
                sendToCorlysis('wifi=devices', data.join()).catch(ex => msg.chart.cor(ex));
            }
        }
    })();

};

module.exports = cron;
