const {get, router} = require('../../lib/utils');
const {msg} = require('../../lib/messages');

/**
 * Reboot router
 */
const reboot = async (opts = {}) => {
    const host = `http://${router(opts).ip}`;
    const PATH = '/cgi-bin/timepro.cgi?tmenu=background&smenu=reboot&act=&commit=reboot';

    try {
        await get(host + PATH, {
            auth: router(opts).cred
        });
    } catch (ex) {
        return ex.toString();
    }

    return msg.common.reboot;
};

module.exports = reboot;
