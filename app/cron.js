const {every} = require('schedule');
const {sendSensorsData, sendConnectedWiFiDevices, checkRaspberryUpdates} = require('./lib/crons');

/**
 * Bot crons
 */
const cron = bot => {
    every('1m').do(() => sendSensorsData(bot));
    every('5m').do(() => sendConnectedWiFiDevices(bot));
    every('6h').do(() => checkRaspberryUpdates());
};

module.exports = cron;
