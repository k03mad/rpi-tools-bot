const {get, router} = require('../../lib/utils');
const {msg} = require('../../lib/messages');

/**
 * Reboot router
 */
const reboot = async place => {
    const host = `http://${router(place).ip}`;
    const PATH = '/cgi-bin/timepro.cgi?tmenu=background&smenu=reboot&act=&commit=reboot';

    try {
        await get(host + PATH, {
            auth: router(place).cred,
        });
    } catch (err) {
        return err.toString();
    }

    return msg.common.reboot;
};

module.exports = reboot;
