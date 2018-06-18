const {msg} = require('../../../messages');
const {run} = require('../../../utils');
const {sendToInflux} = require('../../../utils');

/**
 * Get GPU temperature
 */
const gpuTemp = async () => {
    const gpu = await run('vcgencmd measure_temp');
    return gpu.replace(/temp=|'C\n/g, '');
};

/**
 * Get CPU temperature
 */
const cpuTemp = async () => {
    const cpu = await run('cat /sys/class/thermal/thermal_zone0/temp');
    return (Number(cpu) / 1000).toFixed(1);
};

/**
 * Send cpu and gpu temp
 */
const sendTemp = async () => {
    let cpu;
    let gpu;

    try {
        [cpu, gpu] = await Promise.all([cpuTemp(), gpuTemp()]);
    } catch (err) {
        console.log(msg.cron.temp(err));
        return;
    }

    sendToInflux('pi=temp', {cpu, gpu});
};

module.exports = sendTemp;
