'use strict';

const {shell} = require('utils-mad');

module.exports = () => {
    shell.run('source ~/.autorunrc');
    return 'Launch autorun...';
};
