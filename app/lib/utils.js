const exec = require('executive');
const got = require('got');
const {myChat} = require('./env');

/**
 * Chat ids whitelist
 */
const wl = msg => {
    return [myChat].includes(String(msg.chat.id));
};

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
 * Split long string by \n into array of strings
 */
const splitString = (str, l) => {
    const strs = [];

    while (str.length > l) {
        let pos = str.substring(0, l).lastIndexOf('\n');
        pos = pos <= 0 ? l : pos;
        strs.push(str.substring(0, pos));

        let i = str.indexOf('\n', pos) + 1;

        if (i < pos || i > pos + l) {
            i = pos;
        }

        str = str.substring(i);
    }

    strs.push(str);
    return strs;
};

/**
 * Send request
 */
const get = (url, opts = {}) => {
    opts.timeout = {
        connect: 20000,
        request: 25000,
        socket: 30000
    };

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
 * Known router connected devices list
 */
const KNOWN_DEVICES = {
    S6: 'E8-50-8B-39-55-1D',
    MacH: '78-31-C1-CA-63-9E',
    // MacW: '8C-85-90-17-69-E7',
    TV: '1C-5A-6B-EA-C1-BB',
    N5x: 'A8-B8-6E-48-32-D7',
    Pi3: 'B8-27-EB-22-57-46'
};

/**
 * MAC address RegExp
 */
const MAC_RE = /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/;

module.exports = {
    convertToArray,
    get,
    getMacVendor,
    KNOWN_DEVICES,
    MAC_RE,
    run,
    splitString,
    wl
};
