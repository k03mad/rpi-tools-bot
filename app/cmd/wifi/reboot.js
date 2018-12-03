'use strict';

const {printMsg} = require('../../lib/utils');
const {request} = require('utils-mad');
const {router} = require('../../../env');

module.exports = async () => {
    try {
        await request.got('http://192.168.1.133/cgi-bin/timepro.cgi', {
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
    } catch (err) {
        return printMsg(err);
    }

    return 'Router going to reboot';
};
