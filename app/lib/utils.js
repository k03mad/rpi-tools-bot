const {wifiIP, wifiCred, wifiKnplIP, wifiKnplCred} = require('../../env');
const exec = require('executive');
const got = require('got');
const moment = require('moment');

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
 * Send request
 */
const get = (url, opts = {}) => {
    if (!opts.timeout) {
        opts.timeout = {
            connect: 15000,
            socket: 20000,
            request: 30000
        };
    }

    return got(url, opts);
};

/**
 * Get mac-address vendor info
 */
const getMacVendor = async mac => {
    const {body} = await get(`https://macvendors.co/api/vendorname/${mac}`);
    return body;
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
            cred: wifiKnplCred
        }
        : {
            ip: wifiIP,
            cred: wifiCred
        };
};

/**
 * Get current date
 */
const currentDate = () => {
    return moment().format('YYYY.MM.DD HH:mm:ss');
};

module.exports = {
    convertToArray,
    currentDate,
    get,
    getMacVendor,
    MAC_RE,
    router,
    run
};
