'use strict';

const {adg} = require('utils-mad');

module.exports = async () => {
    const {protection_enabled: state} = await adg.get('dns_info');
    await adg.post('dns_config', {json: {protection_enabled: !state}});
    const {protection_enabled: newState} = await adg.get('dns_info');

    return `Switched from enabled:${state} to enabled:${newState}`;
};
