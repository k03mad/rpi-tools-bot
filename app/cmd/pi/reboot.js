'use strict';

const {shell} = require('@k03mad/utils');

/** @returns {Promise} */
module.exports = () => shell.run('sudo shutdown -r +1');
