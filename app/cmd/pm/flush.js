'use strict';

const {shell} = require('@k03mad/utils');

/** @returns {Promise} */
module.exports = () => shell.run('pm2 flush');
