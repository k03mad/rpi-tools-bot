const {influx, wifi} = require('./env');
const {msg} = require('./messages');
const {promisify} = require('util');
const cheerio = require('cheerio');
const exec = require('executive');
const fs = require('fs');
const moment = require('moment');
const superagent = require('superagent');

const readFile = promisify(fs.readFile);

const MAC_RE = /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/;

/**
 * Superagent default params
 */
const request = () => {
    const agent = superagent.agent()
        .retry(3)
        .timeout({response: 5000, deadline: 10000});

    return agent;
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
 * Cut numbers from stirng
 * @param {String} str
 */
const cutNumbers = str => {
    return Number(str.replace(/\D/gim, ''));
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
        await request()
            .post(`${influx.url}/write`)
            .query({db: influx.db})
            .send(`${influx.meas},${tag} ${send}`);

    } catch (err) {
        console.log(msg.influx.send(tag, send, err));
    }
};

/**
 * Get last measurement data from influxdb
 * @param {String} tag to get
 * @param {String} data to get
 */
const getFromInflux = async (tag, data) => {
    const [tagName, tagValue] = tag.split('=');

    const {body} = await request()
        .post(`${influx.url}/query`)
        .query({
            db: influx.db,
            q: `SELECT LAST("${data}") FROM "pi3" WHERE "${tagName}"='${tagValue}'`,
        });

    return body.results[0].series[0].values[0][1];
};

/**
 * Return router credentials
 * @param {String} place select router
 */
const router = place => {
    return place === 'knpl'
        ? {
            ip: wifi.knpl.ip,
            cred: wifi.knpl.cred,
        }
        : {
            ip: wifi.mad.ip,
            cred: wifi.mad.cred,
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

/**
 * Scrape text from sites
 */
const scrape = (body, selector) => {
    const $ = cheerio.load(body);
    const query = $(selector);

    const output = [];
    query.each((_, elem) => {
        const text = $(elem).text();

        if (text) {
            output.push(text);
        }
    });

    return output;
};

module.exports = {
    checkTimer,
    convertToArray,
    convertToMetric,
    cutNumbers,
    getFromInflux,
    getPiHoleApiPass,
    MAC_RE,
    nowWait,
    request,
    router,
    run,
    scrape,
    sendToInflux,
};
