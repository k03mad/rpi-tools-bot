'use strict';

const {adg} = require('utils-mad');

module.exports = async () => {
    const {protection_enabled: state} = await adg.query('dns_info');
    await adg.query('dns_config', {
        gotOpts: {
            method: 'POST',
            json: {protection_enabled: !state},
        },
    });
    const {protection_enabled: newState} = await adg.query('dns_info');

    return `Switched from enabled:${state} to enabled:${newState}`;
};
