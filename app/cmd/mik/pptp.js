'use strict';

const {shell, print} = require('utils-mad');

/**
 * @param {string} opts
 * @returns {Promise<string>}
 */
module.exports = opts => {
    shell
        .run(`mad-mik-pptp${opts ? ` "${opts}"` : ''}`)
        .catch(err => print.ex(err, {exit: true}));

    return 'Change pptp script started';
};
