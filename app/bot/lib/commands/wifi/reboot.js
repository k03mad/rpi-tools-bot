const {request, routerHost} = require('../../../../utils');
const {msg} = require('../../../../messages');

/**
 * Reboot router
 * @param {String} place select router
 */
const reboot = async place => {
    try {
        await request()
            .get(routerHost(place))
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
