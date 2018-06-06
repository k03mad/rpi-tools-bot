const {influxMeas, influxDb, influxUrl, wifiIP, wifiCred, wifiKnplIP, wifiKnplCred} = require('./env');
const {msg} = require('./messages');
const {promisify} = require('util');
const exec = require('executive');
const fs = require('fs');
const got = require('got');
const moment = require('moment');

const readFile = promisify(fs.readFile);

/**
 * Send command to bash
 * @param {String} str send command to terminal
 */
const run = async str => {
    const {stdout, stderr} = await exec.quiet(str);
    return stdout || stderr;
};

/**
 * Convert anything to array
 * @param {*} elem to convert
 */
const convertToArray = elem => {
    return Array.isArray(elem) ? elem : [elem];
};

/**
 * Wait for some time
 * @param {Number} time in ms
 */
const nowWait = time => {
    return new Promise(resolve => setTimeout(resolve, time));
};

/**
 * Send request
 * @param {String} url request url
 * @param {Object} opts request options
 */
const get = async (url, opts = {}) => {
    // turn off default retries only with timeout catch
    opts.retries = 0;
    // retries for any errors catch
    const RETRIES = 3;

    if (!opts.timeout) {
        opts.timeout = {
            connect: 15000,
            socket: 20000,
            request: 30000,
        };
    }

    let error;

    for (let i = 0; i < RETRIES; i++) {
        try {
            return await got(url, opts);
        } catch (err) {
            error = err;
        }

        await nowWait(1000);
    }

    throw error;
};

/**
 * Store data to influxdb
 * @param {String} tag to add
 * @param {Object} data to send
 */
const sendToInflux = (tag, data) => {
    const dataToObject = [];

    for (const key in data) {
        dataToObject.push(`${key}=${data[key]}`);
    }

    const send = dataToObject.join();

    return get(influxUrl, {
        query: {db: influxDb},
        body: `${influxMeas},${tag} ${send}`,
    }).catch(err => console.log(msg.common.influx(tag, send, err)));
};

/**
 * MAC address RegExp
 */
const MAC_RE = /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/;

/**
 * Return router credentials
 * @param {String} place select router
 */
const router = place => {
    return place === 'knpl'
        ? {
            ip: wifiKnplIP,
            cred: wifiKnplCred,
        }
        : {
            ip: wifiIP,
            cred: wifiCred,
        };
};

/**
 * Read pi-hole web api password
 */
const getPiHoleApiPass = async () => {
    const file = await readFile('/etc/pihole/setupVars.conf');
    const [, pass] = file.toString().match(/WEBPASSWORD=(.+)\n/);
    return pass;
};

/**
 * Check if current time is above setted
 * @param {*} timer moment time
 * @param {*} repeat alarm every N minutes
 */
const checkTimer = (timer, repeat = 30) => {
    return moment().diff(timer, 'minutes') > repeat;
};

/**
 * Convert hPa to mm Hg
 * @param {Number} hPa
 */
const convertToMm = hPa => {
    return hPa * 0.75006375541921;
};

module.exports = {
    checkTimer,
    convertToArray,
    convertToMm,
    get,
    getPiHoleApiPass,
    MAC_RE,
    router,
    run,
    sendToInflux,
};
