'use strict';

const {request} = require('utils-mad');
const {router} = require('../../../env');

/**
 * Reboot router
 */
const reboot = async () => {
    try {
        await request.got('http://192.168.1.133/cgi-bin/timepro.cgi', {
            query: {
                tmenu: 'background',
                smenu: 'reboot',
                act: '',
                commit: 'reboot',
            },
            auth: router,
        });
    } catch (err) {
        return err.message;
    }

    return 'Router going to reboot';
};

module.exports = reboot;
