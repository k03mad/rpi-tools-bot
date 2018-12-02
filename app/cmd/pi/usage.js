'use strict';

const {shell} = require('utils-mad');

/**
 * Get pi usage
 */
const usage = async () => {
    const [load, temp, disk, ram] = await Promise.all([
        shell.run('cat /proc/loadavg'),
        shell.run('cat /sys/class/thermal/thermal_zone0/temp'),
        shell.run('df'),
        shell.run('free -m'),
    ]);

    return [
        `cpu load: ${load.match(/((?:[\d.]+ ){2}[\d.]+)/)[1]}`,
        `cpu temp: ${Number(temp) / 1000} °C`,
        `disk usage: ${disk.match(/\/dev\/root +\d+ +(\d+)/)[1] * 1.0E-6} GB`,
        `ram usage: ${ram.match(/Mem: +\d+ +(\d+)/)[1]} MB`,
    ].join('\n');
};

module.exports = usage;
