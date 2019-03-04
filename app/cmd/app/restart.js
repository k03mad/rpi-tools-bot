'use strict';

const {spawn} = require('child_process');

module.exports = () => {
    spawn('source', ['~/.autorunrc']);
    return 'Launch autorun...';
};
