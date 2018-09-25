const bot = require('./app/bot/bot');
const cron = require('./app/cron/cron');
const {printMsg} = require('./app/date');

cron(bot);

console.log(printMsg('pi started'));
