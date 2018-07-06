const {influxMeas, influxDb, influxUrl, wifiIP, wifiCred, wifiKnplIP, wifiKnplCred} = require('./env');
const {msg} = require('./messages');
const {promisify} = require('util');
const exec = require('executive');
const fs = require('fs');
const got = require('got');
const moment = require('moment');

const readFile = promisify(fs.readFile);

const REQUEST_TIMEOUTS = {
    connect: 7000,
    socket: 8000,
    request: 10000,
};

/**
 * Send command to bash
 * @param {String} str to send
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
 * Store data to influxdb
 * @param {String} tag to add
 * @param {Object} data to send
 */
const sendToInflux = async (tag, data) => {
    if (!data || Object.keys(data).length === 0) {
        console.log(msg.influx.send(tag, 'empty data', ''));
        return;
    }

    const dataToObject = [];

    for (const key in data) {
        dataToObject.push(`${key}=${Math.round(Number(data[key]))}i`);
    }

    const send = dataToObject.join();

    try {
        await got(`${influxUrl}/write`, {
            query: {db: influxDb},
            body: `${influxMeas},${tag} ${send}`,
            timeout: REQUEST_TIMEOUTS,
        });
    } catch (err) {
        console.log(msg.influx.send(tag, send, err));
    }
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
        opts.timeout = REQUEST_TIMEOUTS;
    }

    let error;
    let time;

    for (let i = 0; i < RETRIES; i++) {
        try {
            const start = new Date().getTime();
            const res = await got(url, opts);
            time = new Date().getTime() - start;

            const host = url.replace(/(http(s)?:\/\/)|(www\.)|(\/$)/g, '');
            sendToInflux('requests=got', {[host]: time});

            return res;
        } catch (err) {
            error = err;
        }

        await nowWait(1000);
    }

    throw error;
};

/**
 * Get last measurement data from influxdb
 * @param {String} tag to get
 * @param {String} data to get
 */
const getFromInflux = async (tag, data) => {
    const [tagName, tagValue] = tag.split('=');

    const {body} = await get(`${influxUrl}/query`, {
        query: {
            db: influxDb,
            q: `SELECT LAST("${data}") FROM "pi3" WHERE "${tagName}"='${tagValue}'`,
        },
        json: true,
    });

    return body.results[0].series[0].values[0][1];
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
 * @param {String} timer moment time
 * @param {Number} repeat alarm every N minutes
 */
const checkTimer = (timer, repeat = 60) => {
    return moment().diff(timer, 'minutes') > repeat;
};

/**
 * Convert units to metric system
 * @param {String} unit name
 * @param {String|Number} value to convert
 */
const convertToMetric = (unit, value) => {
    value = Number(value);

    switch (unit) {
        case 'hPa':
            return value * 0.75006375541921;

        case 'mph':
            return value * 0.44704;

        case 'F':
            return (value - 32) / 1.8;

        default:
            console.log(msg.common.converter(unit));
            return value;
    }

};

module.exports = {
    checkTimer,
    convertToArray,
    convertToMetric,
    get,
    getFromInflux,
    getPiHoleApiPass,
    MAC_RE,
    nowWait,
    router,
    run,
    sendToInflux,
};
