'use strict';

const {shell} = require('@k03mad/utils');

const aptUpdate = [
    'update',
    'dist-upgrade -y',
    'autoremove -y',
    'clean',
];

/** @returns {Promise} */
module.exports = async () => {
    const logs = ['__ APT __'];

    for (const apt of aptUpdate) {
        logs.push(
            `>>> ${apt} <<<`,
            await shell.run(`sudo apt-get ${apt}`) || 'empty',
        );
    }

    return logs;
};
