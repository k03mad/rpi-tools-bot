'use strict';

const {shell} = require('utils-mad');

module.exports = () => {
    shell.run('. ~/.autorunrc');
    return 'Launch autorun...';
};
