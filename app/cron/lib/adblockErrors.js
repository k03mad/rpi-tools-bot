const {msg} = require('../../messages');
const {promisify} = require('util');
const {sendToInflux} = require('../../utils');
const appRoot = require('app-root-path');
const fs = require('fs');
const path = require('path');

const stat = promisify(fs.stat);

/**
 * Send adblock update errors
 */
const sendAdbErrors = async () => {
    try {
        await stat(path.join(appRoot.path, '..', 'adblock-hosts-list/output/error.log'));

        const TAG = 'adblock=error';
        sendToInflux(TAG, {errors: 1}).catch(err => console.log(msg.common.influx(TAG, err)));
    } catch (err) {}
};

module.exports = sendAdbErrors;
