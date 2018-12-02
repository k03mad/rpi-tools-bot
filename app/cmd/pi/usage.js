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
        `cpu load: ${load}`,
        `cpu temp: ${Number(temp) / 1000}`,
        `disk usage: ${Number(disk.match(/\/dev\/root +\d+ +(\d+)/)[1])}`,
        `ram usage: ${Number(ram.match(/Mem: +\d+ +(\d+)/)[1])}`,
    ].join('\n');
};

module.exports = usage;
