const {every} = require('schedule');
const {
    checkRaspberryUpdates,
    sendConnectedWiFiDevices,
    sendDnsBlocks,
    sendDnsQueries,
    sendLastFm,
    sendSensorsData,
} = require('./lib/graph/schedule');

/**
 * Bot crons
 */
const cron = bot => {
    every('1m').do(() => sendSensorsData());

    every('5m').do(() => sendConnectedWiFiDevices(bot));

    every('10m').do(() => sendDnsBlocks());
    every('10m').do(() => sendDnsQueries());

    every('15m').do(() => sendLastFm());

    every('5h').do(() => checkRaspberryUpdates(bot));
};

module.exports = cron;
