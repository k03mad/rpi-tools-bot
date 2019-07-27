'use strict';

const {shell} = require('utils-mad');

module.exports = () => {
    shell.run('sleep 5 && pm2 restart all');
    return 'restarting...';
};
