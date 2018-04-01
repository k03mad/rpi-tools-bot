const {run} = require('../../lib/utils');
const {msg} = require('../../lib/messages');

/**
 * Updates count
 *
 * bash log:
 * Inst poppler-utils [0.48.0-2] (0.48.0-2+deb9u1 Raspbian:stable [armhf]) []
 * Inst libpoppler64 [0.48.0-2] (0.48.0-2+deb9u1 Raspbian:stable [armhf])
 */
const updates = async () => {
    const grepUpdates = await run('sudo apt-get update > /dev/null; apt-get upgrade -u -s | grep -P "^Inst"');

    if (grepUpdates) {
        const MSG = 'Updates available:';
        const packages = [];

        grepUpdates.split('Inst ').filter(Boolean).forEach(elem => {
            const [, pkg] = elem.match(/^(.+?) /);
            packages.push(pkg);
        });

        return packages.length > 1
            ? `${MSG}\n\n${packages.join('\n')}`
            : `${MSG} ${packages[0]}`;
    }

    return msg.common.updates;
};

module.exports = updates;
