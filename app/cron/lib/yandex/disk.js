const {msg} = require('../../../messages');
const {run} = require('../../../utils');
const {sendToInflux} = require('../../../utils');

/**
 * Get Yandex Disk files count
 */
const filesCount = () => run('find /media/yandexdisk/ -type f | wc -l');

/**
 * Get Yandex Disk total size
 */
const diskSize = async () => {
    const size = await run('du -s /media/yandexdisk/');
    return size;
};

/**
 * Send disk data
 */
const sendData = async () => {
    let data;

    try {
        data = await Promise.all([filesCount(), diskSize()]);
    } catch (err) {
        console.log(msg.cron.yandex(err));

    }

    console.log(data);
    // sendToInflux('yandex=disk', {files: data[0], size: data[1]});
};

sendData().then();
module.exports = sendData;
