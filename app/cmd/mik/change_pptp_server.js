'use strict';

const {repo, print} = require('utils-mad');

/** @returns {Promise<string>} */
module.exports = () => {
    repo
        .run('mikrotik-pptp-hidemy-ip', 'script')
        .catch(err => print.ex(err, {exit: true}));

    return 'Update script started';
};
