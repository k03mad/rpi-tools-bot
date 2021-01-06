'use strict';

const {shell} = require('utils-mad');

/**
 * @param {string} opts
 * @returns {Promise<string>}
 */
module.exports = opts => shell.run(`mad-next-log ${opts}`);
