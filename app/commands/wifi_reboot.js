const {get} = require('../lib/utils');
const {msg} = require('../lib/messages');
const {wifiLogin, wifiPass, wifiIP} = require('../lib/env');

/**
 * Reboot router
 */
const reboot = async () => {
    const url = `http://${wifiIP}/cgi-bin/timepro.cgi?tmenu=background&smenu=reboot&act=&commit=reboot`;

    try {
        await get(url, {auth: `${wifiLogin}:${wifiPass}`});
        return msg.common.reboot;
    } catch (ex) {
        return ex.toString();
    }
};

module.exports = reboot;
