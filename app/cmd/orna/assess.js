'use strict';

const asTable = require('as-table');
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

    const name = [];
    let nameEnd;

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

    const json = {name: name.join(' ')};

    for (let i = 0; i < prepareData.length; i += 2) {
        json[prepareData[i]] = prepareData[i + 1];
    }

    const item = await orna.get('assess', json);

    if (!item) {
        return 'Item not found';
    }

    const stats = Object.entries(item.stats).map(([stat, data]) => {
        const df = data.values.pop();
        const mf = data.values.pop();
        const l10 = data.values.pop();

        return {'': stat, l10, mf, df};
    });

    return {
        message: [
            `[${item.name}](/orna_item ${item.name}) ${Math.round(item.quality * 100)}%`,
            '',
            `\`\`\`\n${asTable(stats)}\`\`\``,
        ]
            .filter(elem => elem !== null)
            .join('\n'),
        opts: {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
        },
    };
};
