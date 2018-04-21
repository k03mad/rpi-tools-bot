const speedTest = require('speedtest-net');
const {msg} = require('../../lib/messages');
const {getCorlysisChartImage} = require('../../lib/corlysis');

/**
 * Run speed test
 */
const runTest = () => {
    const test = speedTest({maxTime: 5000});

    return new Promise((resolve, reject) => {
        test.on('data', data => {
            resolve([
                Math.round(data.speeds.download),
                Math.round(data.speeds.upload)
            ]);
        });

        test.on('error', ex => {
            reject(ex);
        });
    });
};

/**
 * Format results
 */
const formatResults = async raw => {
    let results;

    try {
        results = await runTest();
    } catch (ex) {
        return msg.common.speed(ex);
    }

    if (raw) {
        return results;
    }

    const output = [`Download: *${results[0]} Mbps*\nUpload: *${results[1]} Mbps*`];

    try {
        output.push(await getCorlysisChartImage(6));
    } catch (ex) {
        output.push(msg.chart.picErr(ex));
    }

    return output;
};

module.exports = formatResults;
