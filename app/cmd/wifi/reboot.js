'use strict';

const {printMsg} = require('../../lib/utils');
const {request} = require('utils-mad');
const {router} = require('../../../env');

module.exports = async () => {
    try {
        await request.got('http://19.168.1.133/cgi-bin/timepro.cgi', {
            query: {
                tmenu: 'background',
                smenu: 'reboot',
                act: '',
                commit: 'reboot',
            },
            auth: [
                router.login,
                router.password,
            ].join(':'),
        });
        return 'Router going to reboot';
    } catch (err) {
        return printMsg(err);
    }
};
