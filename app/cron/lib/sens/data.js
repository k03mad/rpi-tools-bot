const appRoot = require('app-root-path');
const msg = require('../../../errors');
const parseJson = require('json-parse-better-errors');
const {sendToInflux} = require('../../../utils');
const {shell} = require('utils-mad');

/**
 * Send connected sensors data
 */
const sendSensorsData = async () => {
    let log, values;

    try {
        log = await shell.run(`python ${appRoot}/sensors.py`);
        values = parseJson(log);

        sendToInflux({db: 'sensors', tags: {sensors: 'data'}, values});
    } catch (err) {
        console.log(msg.cron.sensor(log, err));
    }
};

module.exports = sendSensorsData;
