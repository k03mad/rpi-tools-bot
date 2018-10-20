const {influx} = require('./env');
const exec = require('executive');
const msg = require('./errors');
const superagent = require('superagent');

const UFW_LOG = '/var/log/ufw.log';

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
 * Convert anything to array
 * @param {*} elem to convert
 */
const convertToArray = elem => {
    return Array.isArray(elem) ? elem : [elem];
};

/**
 * Send command to bash
 * @param {String} str to send
 * @param {Object} opts
 * @param {Boolean} opts.titles add titles to output
 */
const run = async (cmds, opts = {}) => {
    const message = [];

    for (const cmd of convertToArray(cmds)) {
        const {stdout, stderr} = await exec.quiet(cmd);

        if (stdout) {
            message.push(opts.titles ? `[${cmd}]\n\n${stdout}` : stdout);
        } else {
            message.push(opts.titles ? `[ERROR: ${cmd}]\n\n${stderr}` : stderr);
        }
    }

    return message.join('\n\n');
};

/**
 * Cut numbers from stirng
 * @param {String} str
 */
const cutNumbers = str => Number(str.replace(/\D/gim, ''));

/**
 * Wait for some time
 * @param {Number} time in ms
 */
const nowWait = time => new Promise(resolve => setTimeout(resolve, time));

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
        dataToObject.push(`${key}=${Number(data[key]).toFixed(2)}`);
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

module.exports = {
    convertToArray,
    cutNumbers,
    nowWait,
    request,
    run,
    sendToInflux,
    UFW_LOG,
};
