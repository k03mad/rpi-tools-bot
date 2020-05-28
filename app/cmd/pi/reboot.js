'use strict';

const {shell} = require('utils-mad');

/** @returns {Promise} */
module.exports = () => shell.run('sudo shutdown -r +1');
