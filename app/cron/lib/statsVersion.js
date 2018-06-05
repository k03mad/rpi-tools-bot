const {msg} = require('../../messages');
const {run} = require('../../utils');
const {sendToInflux} = require('../../utils');

/**
 * Some versions
 */
const sendVersions = async () => {
    let versions;

    try {
        versions = await Promise.all([
            run('cat /etc/*release | head -n 1'),
            run('uname -rs'),
            run('node -v'),
            run('npm -v'),
        ]);
    } catch (err) {
        console.log(msg.stats.version(err));
        return;
    }

    const system = versions[0].replace(/PRETTY_NAME=|"/g, '') + versions[1];
    console.log('​-------------------------------');
    console.log('​sendVersions -> system', system);
    console.log('​-------------------------------');
    const node = `${versions[0].replace(/^v/, '')}npm: ${versions[1].replace('\n', '')}`;
    console.log('​---------------------------');
    console.log('​sendVersions -> node', node);
    console.log('​---------------------------');

    const TAG = 'stat=version';
    sendToInflux(TAG, `ver=${system}\n${node}`).catch(err => console.log(msg.common.influx(TAG, err)));
};

module.exports = sendVersions;
