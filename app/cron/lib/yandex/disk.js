const {msg} = require('../../../messages');
const {run} = require('../../../utils');
const {sendToInflux} = require('../../../utils');

/**
 * Get Yandex Disk files count
 */
const filesCount = async () => {
    const files = await run('find /media/yandexdisk/ -type f | wc -l');
    return files.split('\n');
};

/**
 * Get Yandex Disk total size
 */
const diskSize = async () => {
    const size = await run('du -s /media/yandexdisk/');
    return size.split('\t');
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
