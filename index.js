'use strict';

const {printMsg} = require('./app/lib/utils');

require('./app/bot');
require('./app/cron');

printMsg('pi started');
