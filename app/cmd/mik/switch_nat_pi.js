'use strict';

const {shell} = require('utils-mad');

/** @returns {Promise<string>} */
module.exports = () => shell.run('mad-mik-nat');
