'use strict';

const {shell} = require('utils-mad');

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
