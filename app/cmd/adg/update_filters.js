'use strict';

const {adg} = require('utils-mad');

module.exports = () => adg.query(
    'filtering/refresh', {
        gotOpts: {
            method: 'POST',
            responseType: 'text',
        },
    },
);
