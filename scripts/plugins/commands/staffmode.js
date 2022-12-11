import { MinecraftEffectTypes } from "@minecraft/server";
import { STAFFMODE_TAG, ST_ITEM_NAMES } from "../../config";
import { createItem, getItemData, give, giveMany, newItem } from "../../extras/Utils";
import { Command } from "../../lib/Command.js";
import { Database } from "../../lib/Database";
const invs = new Database('INVS', 'ST');
new Command({
    name: "staffmode",
    aliases: ["stm"],
    admin: true,
    description: "Turn on/off staff mode"
}, async (player) => {
    const stafftools = {
        freeze: createItem('minecraft:ice', {
            nameTag: ST_ITEM_NAMES.FREEZE_ITEM_NAMETAG,
            lore: ['§➥§l§eStaff§btools', '§' + ['I', 'D', ':', 'FREEZE'.split('').join('§')].join('§'), '§7Hint: Hit the player while holding', '§7to freeze them']
        }),
        vanish: createItem('minecraft:clock', {
            nameTag: ST_ITEM_NAMES.VANISH_ITEM_NAMETAG,
            lore: ['§➥§l§eStaff§btools', '§' + ['I', 'D', ':', 'VANISH'.split('').join('§')].join('§'), '§7Hint: Right-click while holding', '§7to turn on/off vanish'],
        }),
        info: createItem('minecraft:book', {
            nameTag: ST_ITEM_NAMES.INFO_ITEM_NAMETAG,
            lore: ['§➥§l§eStaff§btools', '§' + ['I', 'D', ':', 'INFO'.split('').join('§')].join('§'), '§7Hint: Hit the player while holding', '§7to see their info'],
        }),
        kill: createItem('minecraft:barrier', {
            nameTag: ST_ITEM_NAMES.KILL_ITEM_NAMETAG,
            lore: ['§➥§l§eStaff§btools', '§' + ['I', 'D', ':', 'KILL'.split('').join('§')].join('§'), '§7Hint: Hit the player while holding', '§7to kill them']
        }),
        teleport: createItem('minecraft:paper', {
            nameTag: ST_ITEM_NAMES.CLICK_TELEPORT_ITEM_NAMETAG,
            lore: ['§➥§l§eStaff§btools', '§' + ['I', 'D', ':', 'CLICK-TELEPORT'.split('').join('§')].join('§'), '§7Hint: Hit a block while holding', '§7to teleport to the block-location']
        }),
        randomTeleport: createItem('minecraft:compass', {
            nameTag: ST_ITEM_NAMES.RANDOM_TELEPORT_ITEM_NAMETAG,
            lore: ['§➥§l§eStaff§btools', '§' + ['I', 'D', ':', 'RANDOM-TELEPORT'.split('').join('§')].join('§'), '§7Hint: Right-click while holding', '§7to teleport']
        })
    };
    const inv = player.getComponent('inventory').container;
    if (player.hasTag(STAFFMODE_TAG)) {
        try {
            await player.runCommandAsync("effect @s clear");
            await player.runCommandAsync("clear");
        }
        catch { }
        const hasSavedItems = invs.has(player.id);
        if (hasSavedItems) {
            const savedItems = invs.read(player.id);
            player.triggerEvent("unvanish");
            const items = savedItems;
            console.warn(JSON.stringify(items));
            //@ts-ignore
            items?.forEach((item) => give(player, newItem(item)));
            invs.delete(player.id);
        }
        player.tell({ rawtext: [{ translate: 'api.commands.st.staffmodeoff' }] }); //Traducir §eStaff§bmode §cDESACTIVADO
        return player.removeTag(STAFFMODE_TAG);
    }
    const items = [];
    for (let i = 0; i < inv.size; i++) {
        const item = inv.getItem(i);
        if (!item)
            continue;
        items.push(getItemData(item));
    }
    invs.write(player.id, items);
    try {
        await player.runCommandAsync('clear');
    }
    catch { }
    player.tell({ rawtext: [{ translate: 'api.commands.st.inventoryremoved' }] });
    giveMany(player, Object.values(stafftools));
    player.addEffect(MinecraftEffectTypes.invisibility, 9999999, 255, false);
    player.addEffect(MinecraftEffectTypes.nightVision, 9999999, 255, false);
    player.triggerEvent("vanish");
    player.tell({ rawtext: [{ translate: 'api.commands.st.staffmodeon' }] });
    player.playSound("random.levelup");
    player.addTag(STAFFMODE_TAG);
});
