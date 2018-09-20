const bot = require('./app/bot/bot');
const cron = require('./app/cron/cron');

cron(bot);

console.log((new Date()).toString(), 'pi started');
