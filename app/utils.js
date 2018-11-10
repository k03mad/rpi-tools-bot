const msg = require('./errors');
const {influx} = require('utils-mad');

const UFW_LOG = '/var/log/ufw.log';
const PIHOLE_URL = 'http://localhost/admin/api.php';

/**
 * Open repo and run script
 * @param {string} repo to change dir
 * @param {string} script to run
 * @returns {string}
 */
const runRepoScript = (repo, script) => [
    `cd ~/git/${repo}`,
    'git reset --hard',
    'git pull',
    'npm run setup',
    `npm run ${script}`,
];

/**
 * Store data to influxdb
 * @param {Object} data to send
 */
const sendToInflux = async data => {
    try {
        await influx.write({
            url: 'http://192.168.1.100:8086',
            meas: 'pi3',
            db: data.db || 'hole',
            tags: data.tags,
            values: data.values,
        });
    } catch (err) {
        console.log(msg.influx.send(err));
    }
};

module.exports = {
    run,
    runRepoScript,
    sendToInflux,
    PIHOLE_URL,
    UFW_LOG,
};
