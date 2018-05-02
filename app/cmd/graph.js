const {getCorlysisChartImage} = require('../lib/corlysis');
const {msg} = require('../lib/messages');

/**
 * Get corlysis charts
 */
const graph = async () => {
    const GRAPHS_COUNT = 6;
    const ids = Array.from(Array(GRAPHS_COUNT), (_, x) => ++x);

    const output = [];
    await Promise.all(ids.map(async elem => {
        try {
            output.push(await getCorlysisChartImage(elem));
        } catch (ex) {
            output.push(msg.chart.picErr(ex));
        }
    }));

    return output;
};

module.exports = graph;
