'use strict';

const {shell, print} = require('utils-mad');

/** @returns {Promise<string>} */
module.exports = () => {
    shell
        .run('mad-pptp')
        .catch(err => print.ex(err, {exit: true}));

    return 'Change pptp script started';
};
