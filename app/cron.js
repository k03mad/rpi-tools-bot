const {every} = require('schedule');
const {sendSensorsData, sendConnectedWiFiDevices, checkRaspberryUpdates} = require('./lib/crons');

/**
 * Bot crons
 */
const cron = bot => {
    every('1m').do(() => sendSensorsData());
    every('5m').do(() => sendConnectedWiFiDevices(bot));
    every('5h').do(() => checkRaspberryUpdates(bot));
};

module.exports = cron;
