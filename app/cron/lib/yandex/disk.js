const {msg} = require('../../../messages');
const {run} = require('../../../utils');
const {sendToInflux} = require('../../../utils');

/**
 * Get Yandex Disk files count
 */
const filesCount = async () => {
    const files = await run('find /media/yandexdisk/ -type f | wc -l');
    return files.split('\n')[0];
};

/**
 * Get Yandex Disk total size
 */
const diskSize = async () => {
    const size = await run('du -s /media/yandexdisk/');
    return size.split('\t')[0];
};

/**
 * Send disk data
 */
const sendData = async () => {
    let files;
    let size;

    try {
        [files, size] = await Promise.all([filesCount(), diskSize()]);
    } catch (err) {
        console.log(msg.cron.yandex(err));
    }

    sendToInflux('yandex=disk', {files, size});
};

module.exports = sendData;
