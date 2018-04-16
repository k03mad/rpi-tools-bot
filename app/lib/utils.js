const {metricsToken} = require('../../env');
const {wifiIP, wifiCred, wifiKnplIP, wifiKnplCred} = require('../../env');
const botmetrics = require('node-botmetrics')(metricsToken);
const exec = require('executive');
const got = require('got');
const moment = require('moment');

/**
 * Track current command
 */
const track = msg => {
    let {text} = msg;

    if (text) {
        if (text.includes(' ')) {
            text = text.substr(0, text.indexOf(' '));
        }

        if (text.includes('@')) {
            text = text.substr(0, text.indexOf('@'));
        }

        botmetrics.track({
            message_type: 'incoming',
            metadata: msg,
            platform: 'telegram',
            text,
            user_id: msg.from.username || `${msg.from.first_name} ${msg.from.last_name}`
        });
    }
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
 * Send request
 */
const get = (url, opts = {}) => {
    if (!opts.timeout) {
        opts.timeout = {
            connect: 20000,
            request: 25000,
            socket: 30000
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
const router = opts => {
    return opts.place
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
    return moment().format('YYYY.MM.DD HH:MM:SS');
};

module.exports = {
    convertToArray,
    currentDate,
    get,
    getMacVendor,
    MAC_RE,
    router,
    run,
    track
};
