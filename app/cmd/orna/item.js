'use strict';

const {orna} = require('utils-mad');

/**
 * @param {string} opts
 * @returns {Promise<string>}
 * https://orna.guide/gameplay?show=16
 */
module.exports = async opts => {
    const [item] = await orna.get('item', {name: opts});

    const message = [
        `[${item.name}](${orna.web(item.id)})`,
        `${item.element ? `${item.element} ` : ''}${item.type} \\*${item.tier}`,
        '',
        item.description,
        '',
    ].filter(elem => elem !== null);

    const [droppedBy, materials] = await Promise.all([
        Promise.all(item.dropped_by.map(async dropped => {
            const [body] = await orna.get('monster', {id: dropped.id});
            dropped.tier = body.tier;
            return dropped;
        })),

        Promise.all(item.materials.map(async material => {
            const [body] = await orna.get('item', {id: material.id});
            material.tier = body.tier;
            return material;
        })),
    ]);

    message.push(
        `*Dropped by${item.boss ? ' boss:' : ':'}*`,
        droppedBy
            ? droppedBy
                .sort((a, b) => b.tier - a.tier)
                .map(elem => `[${elem.name} *${elem.tier}](${orna.web(elem.id, 'monsters')})`)
                .join('\n')
            : null,
        item.arena ? 'arena' : null,
        '',
        '*Equipped by:*',
        `${item.equipped_by.map(elem => `[${elem.name}](${orna.web(elem.id, 'classes')})`).join('\n')}`,
        '',
        '*Materials:*',
        materials
            .sort((a, b) => b.tier - a.tier)
            .map(elem => `[${elem.name} *${elem.tier}](${orna.web(elem.id)})`)
            .join('\n'),
    );

    return {
        message: message.join('\n'),
        opts: {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
        },
    };
};
