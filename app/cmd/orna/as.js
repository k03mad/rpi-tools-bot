'use strict';

const asTable = require('as-table');
const {request} = require('utils-mad');

/**
 * @param {string} opts
 * @returns {Promise<string>}
 * https://orna.guide/gameplay?show=16
 */
module.exports = async opts => {
    const mapping = {
        l: 'level',
        hp: 'hp',
        mp: 'mana',
        att: 'attack',
        mag: 'magic',
        def: 'defense',
        res: 'resistance',
        dex: 'dexterity',
        ward: 'ward',
        crit: 'crit',
    };

    if (!opts || !opts.match(/[ =]/)) {
        return [
            'Something wrong with params, example: vulcan buckler res=56',
            `Supported stats: ${Object.keys(mapping).join(', ')}`,
        ].join('\n');
    }

    const name = [];

    const json = Object.fromEntries(opts
        .split(' ')
        .map(stats => {
            if (!stats.includes('=')) {
                name.push(stats);
                return '';
            }

            return stats.split('=').map(elem => Number(elem) || mapping[elem] || elem);
        })
        .filter(Boolean),
    );

    if (name.length > 0) {
        json.name = name.join(' ');
    }

    let body;

    try {
        ({body} = await request.got('https://orna.guide/api/v1/assess', {method: 'POST', json}));
    } catch (err) {
        if (err.response && err.response.body) {
            const {error} = JSON.parse(err.response.body);

            if (error) {
                return error;
            }
        }

        throw err;
    }

    const stats = Object.entries(body.stats).map(([stat, data]) => {
        const df = data.values.pop();
        const mf = data.values.pop();
        const l10 = data.values.pop();

        return {'': stat, l10, mf, df};
    });

    return [
        `${body.name} (${body.quality * 100}%)`,
        '',
        asTable(stats),
    ].join('\n');
};
