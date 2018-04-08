const {get, router} = require('../../lib/utils');
const {msg} = require('../../lib/messages');

/**
 * Reboot router
 */
const reboot = async (opts = {}) => {
    const host = `http://${router(opts).ip}`;
    const ports = [':2828', ':80'];
    const PATH = '/cgi-bin/timepro.cgi?tmenu=background&smenu=reboot&act=&commit=reboot';

    const err = [];

    for (const port of ports) {
        try {
            await get(host + port + PATH, {auth: router(opts).cred});
        } catch (ex) {
            err.push(ex.toString());
        }
    }

    if (err.length > 1) {
        return err[0];
    }

    return msg.common.reboot;
};

// reboot({place: 'knpl'}).then(console.log);

module.exports = reboot;
