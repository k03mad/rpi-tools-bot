'use strict';

const b = require('require-all')(`${__dirname}/cmd`);
const cron = require('node-cron');

cron.schedule('0 * * * *', () => b.dns.update());
cron.schedule('30 5 * * *', () => b.pi.reboot());
