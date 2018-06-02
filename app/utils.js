const {corlysisToken, corlysisDash, corlysisDb, corlysisWrite, wifiIP, wifiCred, wifiKnplIP, wifiKnplCred} = require('./env');
const exec = require('executive');
const got = require('got');
const moment = require('moment');
const fs = require('fs');
const {promisify} = require('util');

const readFile = promisify(fs.readFile);

/**
 * Send command to bash
 */
const run = async str => {
    const {stdout, stderr} = await exec.quiet(str);
    return stdout || stderr;
};

/**
 * Convert anything to array
 */
const convertToArray = elem => {
    return Array.isArray(elem) ? elem : [elem];
};

/**
 * Wait for some time
 */
const nowWait = time => {
    return new Promise(resolve => setTimeout(resolve, time));
};

/**
 * Send request
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
 * Send data to corlysis
 */
const sendToCorlysis = (field, data) => {
    return get(corlysisWrite, {
        query: {
            db: corlysisDb,
        },
        body: `${corlysisDash},${field} ${data}`,
        auth: `token:${corlysisToken}`,
    });
};

/**
 * MAC address RegExp
 */
const MAC_RE = /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/;

/**
 * Return router credentials
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
 * Get current date
 */
const currentDate = () => {
    return moment().format('YYYY.MM.DD HH:mm:ss');
};

/**
 * Read pi-hole web api password
 */
const getPiHoleApiPass = async () => {
    const file = await readFile('/etc/pihole/setupVars.conf');
    const [, pass] = file.toString().match(/WEBPASSWORD=(.+)\n/);
    return pass;
};

module.exports = {
    convertToArray,
    currentDate,
    get,
    getPiHoleApiPass,
    MAC_RE,
    router,
    run,
    sendToCorlysis,
};
