const {currentDate} = require('./app/utils');
const bot = require('./app/bot/bot');
const cron = require('./app/cron/cron');

cron(bot);

console.log(currentDate(), '[pi started]');
