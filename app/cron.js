const {every} = require('schedule');
const {msg} = require('./lib/messages');
const {myChat} = require('./lib/env');
const {sendCo2ChartCor, sendCo2ChartTS} = require('./lib/charts');
const c = require('require-all')(`${__dirname}/cmd`);
const moment = require('moment');
const {KNOWN_DEVICES, MAC_RE} = require('./lib/utils');

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
            bot.sendMessage(myChat, updates);
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
            sendCo2ChartTS(ppm).catch(ex => msg.chart.ts(ex));
            sendCo2ChartCor(ppm).catch(ex => msg.chart.cor(ex));

            // send warning every REPEAT_ALARM minutes until ppm drop
            if (ppm > PPM_WARNING && moment().diff(ppmTimer, 'minutes') > PPM_REPEAT_ALARM) {
                bot.sendMessage(myChat, msg.co2.warning(ppm));
                ppmTimer = moment();
            }
        }
    });

    // check for unknown device connected to router
    every('5m').do(async () => {
        const devices = (await c.wifi.devices()).split('\n\n');
        const known = Object.values(KNOWN_DEVICES).join();

        const unknown = [];
        devices.forEach(elem => {
            if (!known.includes(elem.match(MAC_RE)[0])) {
                unknown.push(elem);
            }
        });

        if (unknown.length > 0) {
            bot.sendMessage(myChat, msg.common.unknownDev(unknown.join('\n\n')));
        }
    });

    // // remove old data from corlysis due to free plan
    // every('10h').do(() => {
    //     removeOldDataCor().catch(ex => msg.chart.corRem(ex));
    // });

};

module.exports = cron;
