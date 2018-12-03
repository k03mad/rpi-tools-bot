'use strict';

const bot = require('./app/bot');
const cron = require('./app/cron');
const {printMsg} = require('./app/lib/utils');

cron(bot);

printMsg('pi started');
