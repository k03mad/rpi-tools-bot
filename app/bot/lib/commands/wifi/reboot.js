const {get, router} = require('../../../../utils');
const {msg} = require('../../../../messages');

/**
 * Reboot router
 * @param {String} place select router
 */
const reboot = async place => {
    const host = `http://${router(place).ip}`;
    const auth = router(place).cred;

    const PATH = '/cgi-bin/timepro.cgi?tmenu=background&smenu=reboot&act=&commit=reboot';

    try {
        await get(host + PATH, {auth});
    } catch (err) {
        return err.toString();
    }

    return msg.common.reboot;
};

module.exports = reboot;
