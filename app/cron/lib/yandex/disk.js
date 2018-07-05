const {msg} = require('../../../messages');
const {run} = require('../../../utils');
const {sendToInflux} = require('../../../utils');

const MIN_SIZE = 1000000; // 1gb
const MIN_FILES = 1000;

/**
 * Get Yandex Disk files count
 */
const filesCount = async () => {
    const files = await run('find /media/yandexdisk/ -type f | wc -l');
    const count = Number(files.split('\n')[0]);

    if (count < MIN_FILES) {
        throw new Error(`Current count: ${count}, expected above ${MIN_FILES}`);
    } else {
        return count;
    }
};

/**
 * Get Yandex Disk total size
 */
const diskSize = async () => {
    const size = await run('du -s /media/yandexdisk/');
    const count = Number(size.split('\t')[0]);

    if (count < MIN_SIZE) {
        throw new Error(`Current size: ${count}, expected above ${MIN_FILES}`);
    } else {
        return count;
    }
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
