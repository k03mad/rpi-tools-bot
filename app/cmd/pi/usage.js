'use strict';

const {printMsg} = require('../../lib/utils');
const {shell} = require('utils-mad');

module.exports = async () => {
    const [load, temp, disk, ram] = await Promise.all([
        shell.run('cat /proc/loadavg'),
        shell.run('cat /sys/class/thermal/thermal_zone0/temp'),
        shell.run('df'),
        shell.run('free -m'),
    ]).catch(err => printMsg(err));

    const [, matchLoad] = load.match(/((?:[\d.]+ ){3})/);
    const [, matchDisk] = disk.match(/\/dev\/root +\d+ +(\d+)/);
    const [, matchRam] = ram.match(/Mem: +\d+ +(\d+)/);

    return [
        `cpu load: ${matchLoad}`,
        `cpu temp: ${temp / 1000} °C`,
        `disk usage: ${(matchDisk * 1.0E-6).toFixed(3)} GB`,
        `ram usage: ${matchRam} MB`,
    ].join('\n');
};
