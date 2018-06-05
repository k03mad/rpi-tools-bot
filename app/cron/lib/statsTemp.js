const {msg} = require('../../messages');
const {run} = require('../../utils');
const {sendToInflux} = require('../../utils');

/**
 * Get GPU temperature
 *
 * bash log:
 * temp=50.5'C
 */
const gpuTemp = async () => {
    const gpu = await run('vcgencmd measure_temp');
    return gpu.replace(/temp=|'C\n/g, '');
};

/**
 * Get CPU temperature
 *
 * bash log:
 * temp=50.5'C
 */
const cpuTemp = async () => {
    const cpu = await run('cat /sys/class/thermal/thermal_zone0/temp');
    return (Number(cpu) / 1000).toFixed(1);
};

/**
 * Send cpu and gpu temp
 */
const sendTemp = async () => {
    let temp;

    try {
        temp = await Promise.all([cpuTemp(), gpuTemp()]);
    } catch (err) {
        console.log(msg.stats.temp(err));
        return;
    }

    const TAG = 'stat=temp';
    sendToInflux(TAG, `cpu=${temp[0]},gpu=${temp[1]}`).catch(err => console.log(msg.common.influx(TAG, err)));
};

module.exports = sendTemp;
