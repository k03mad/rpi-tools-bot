'use strict';

const {log, request} = require('utils-mad');
const {router} = require('../../../../env');

module.exports = async () => {
    try {
        await request.got(router.url, {
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
        return log.print(err);
    }
};
