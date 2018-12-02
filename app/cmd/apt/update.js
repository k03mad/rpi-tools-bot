'use strict';

const {shell} = require('utils-mad');

/**
 * Check updates
 *
 * bash log:
 * Inst poppler-utils [0.48.0-2] (0.48.0-2+deb9u1 Raspbian:stable [armhf]) []
 * Inst libpoppler64 [0.48.0-2] (0.48.0-2+deb9u1 Raspbian:stable [armhf])
 */
const update = async () => {
    try {
        const grepUpdates = await shell.run('sudo apt-get update > /dev/null; apt-get upgrade -u -s | grep -P "^Inst"');
        const MSG = 'Updates available:';
        const packages = [];

        grepUpdates.split('Inst ').filter(Boolean).forEach(elem => {
            const [, pkg] = elem.match(/^(.+?) /);
            packages.push(pkg);
        });

        return packages.length > 1
            ? `${MSG}\n\n${packages.join('\n')}`
            : `${MSG} ${packages[0]}`;
    } catch (err) {
        return 'No updates available';
    }
};

module.exports = update;
