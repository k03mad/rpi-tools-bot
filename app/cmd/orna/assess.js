'use strict';

const asTable = require('as-table');
const getItem = require('./item');
const {orna} = require('utils-mad');

/**
 * @param {string} opts
 * @returns {Promise<string>}
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

    const nameArr = [];
    let nameEnd;

    const prepareData = opts
        .split(' ')
        .map(stat => {
            if (!statsNames.includes(stat) && !nameEnd) {
                nameArr.push(stat);
                return '';
            }

            nameEnd = true;
            return Number(stat) || mapping[stat] || stat;
        })
        .filter(Boolean);

    const name = nameArr.join(' ');

    const json = {name};

    for (let i = 0; i < prepareData.length; i += 2) {
        json[prepareData[i]] = prepareData[i + 1];
    }

    const [assess, item] = await Promise.all([
        orna.get('assess', json),
        getItem(name),
    ]);

    if (!assess) {
        return 'Item not found';
    }

    const stats = Object.entries(assess.stats).map(([stat, data]) => {
        const df = data.values.pop();
        const mf = data.values.pop();
        const l10 = data.values.pop();

        return {'': stat, l10, mf, df};
    });

    return [
        item,
        {
            message: `\`\`\`\n${asTable(stats)}\`\`\``,
            opts: {
                parse_mode: 'Markdown',
            },
        },
    ];
};
