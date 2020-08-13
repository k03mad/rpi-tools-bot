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
        lvl: 'level',
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

    const statsNames = Object.keys(mapping);

    if (!opts || !opts.includes(' ') || !opts.match(statsNames.join('|'))) {
        return [
            'Something wrong with stats, example: vulcan buckler res 56',
            `Supported stats: ${statsNames.join(', ')}`,
        ].join('\n');
    }

    const name = [];
    let body, json, nameEnd;

    const prepareData = opts
        .split(' ')
        .map(stat => {
            if (!statsNames.includes(stat) && !nameEnd) {
                name.push(stat);
                return '';
            }

            nameEnd = true;
            return Number(stat) || mapping[stat] || stat;
        })
        .filter(Boolean);

    if (name.length > 0) {
        json = {name: name.join(' ')};
    } else {
        return 'Something wrong with item name, example: vulcan buckler res 56';
    }

    for (let i = 0; i < prepareData.length; i += 2) {
        json[prepareData[i]] = prepareData[i + 1];
    }

    try {
        ({body} = await request.got('https://orna.guide/api/v1/assess', {method: 'POST', json}));
    } catch (err) {
        if (err.response && err.response.body) {
            const {error} = JSON.parse(err.response.body);

            if (error) {
                return `${error}\n\n${JSON.stringify(json, 0, 2)}`;
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
        `${body.name} *${body.tier} (${body.type} ${body.quality * 100}%)`,
        '',
        body.description,
        '',
        asTable([
            ['Dropped by', `${body.dropped_by.map(elem => elem.name).join(', ')} ${body.boss ? '(boss)' : ''}`],
            ['Equipped by', body.equipped_by.map(elem => elem.name).join(', ')],
            ['Materials', body.materials.map(elem => elem.name).join(', ')],
        ]),
        '',
        asTable(stats),
    ].join('\n');
};
