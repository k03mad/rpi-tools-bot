const {run} = require('../../../utils');

/**
 * Check updates
 *
 * bash log:
 * Inst poppler-utils [0.48.0-2] (0.48.0-2+deb9u1 Raspbian:stable [armhf]) []
 * Inst libpoppler64 [0.48.0-2] (0.48.0-2+deb9u1 Raspbian:stable [armhf])
 */
const update = async () => {
    const grepUpdates = await run('sudo apt-fast update > /dev/null; apt-fast upgrade -u -s | grep -P "^Inst"');

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

    return 'No updates available';
};

module.exports = update;
