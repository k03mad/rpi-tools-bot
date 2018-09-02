const {request, router} = require('../../../../utils');
const {msg} = require('../../../../messages');

/**
 * Reboot router
 * @param {String} place select router
 */
const reboot = async place => {
    const host = `http://${router(place).ip}/cgi-bin/timepro.cgi`;

    try {
        await request()
            .get(host)
            .auth(router(place).cred)
            .query({
                tmenu: 'background',
                smenu: 'reboot',
                act: '',
                commit: 'reboot',
            });
    } catch (err) {
        return err.toString();
    }

    return msg.common.reboot;
};

module.exports = reboot;
