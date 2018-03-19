const {every} = require('schedule');
const {msg} = require('./lib/messages');
const {removeOldDataCor, sendCo2ChartCor, sendCo2ChartTS} = require('./lib/charts');
const co2 = require('./commands/pi/co2');

// send data to charts
every('1m').do(async () => {
    let ppm;

    try {
        ppm = await co2('num');
    } catch (ex) {
        console.log(msg.chart.err(ex));
    }

    if (ppm) {
        sendCo2ChartTS(ppm).catch(ex => msg.chart.ts(ex));
        sendCo2ChartCor(ppm).catch(ex => msg.chart.cor(ex));
    }
});

// remove old data from corlysis due to free plan
every('10h').do(() => {
    removeOldDataCor().catch(ex => msg.chart.corRem(ex));
});
