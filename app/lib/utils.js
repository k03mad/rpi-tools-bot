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
    opts.retries = 1;
    opts.timeout = {
        connect: 15000,
        request: 15000,
        socket: 15000
    };

    return got(url, opts);
};

module.exports = {
    convertToArray,
    get,
    run,
    splitString,
    wl
};
