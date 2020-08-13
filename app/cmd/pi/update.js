'use strict';

const {shell} = require('utils-mad');

/** @returns {Promise} */
module.exports = async () => {
    const logs = [];

    const aptUpdate = [
        'sudo apt-get update',
        'sudo apt-get dist-upgrade -y',
        'sudo apt-get autoremove -y',
        'sudo apt-get clean',
    ];

    for (const apt of aptUpdate) {
        logs.push(
            `>>> ${apt.split(' ')[2]} <<<`,
            await shell.run(apt) || 'empty',
        );
    }

    return logs;
};
