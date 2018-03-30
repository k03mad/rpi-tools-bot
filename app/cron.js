const {every} = require('schedule');
const {msg} = require('./lib/messages');
const {myChat} = require('./lib/env');
const {sendCo2ChartCor, sendCo2ChartTS} = require('./lib/charts');
const c = require('require-all')(`${__dirname}/cmd`);
const moment = require('moment');

/**
 * Bot crons
 */
const cron = bot => {

    let now = moment();

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

            // send warning every 30 minutes until ppm drop
            if (ppm > 1000 && moment().diff(now, 'minutes') > 30) {
                bot.sendMessage(myChat, msg.co2.warning(ppm));
                now = moment();
            }
        }
    });

    // // remove old data from corlysis due to free plan
    // every('10h').do(() => {
    //     removeOldDataCor().catch(ex => msg.chart.corRem(ex));
    // });

};

module.exports = cron;
