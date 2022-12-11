import { Location } from "@minecraft/server";
import { setTickTimeout } from "../../extras/Scheduling";
import { ST } from "../../lib/Stafftools.js";
import { viewStats } from "../Forms/ST/ViewStats";
/**
 * Freeze ST Event registration
 */
new ST('FREEZE').onHit(({ player, victim }) => {
    let isFreeze = false, freezeTag = "";
    let tags = victim.getTags();
    for (let tag of tags) {
        if (tag.startsWith('ST-Freeze:')) {
            freezeTag = tag;
            isFreeze = true;
        }
    }
    if (isFreeze) {
        victim.removeTag(freezeTag);
        victim.removeTag('isFreeze');
        victim.tell('§bYou have been unfrozen');
        return player.tell(`§aYou have unfrozen §6${victim.name}`);
    }
    const freezeData = {
        pos: {
            x: Math.round(victim.location.x),
            y: Math.round(victim.location.y),
            z: Math.round(victim.location.z)
        },
        dimension: victim.dimension.id
    };
    victim.addTag(`ST-Freeze:${freezeData.pos.x},${freezeData.pos.y},${freezeData.pos.z},${freezeData.dimension}`);
    victim.addTag('isFreeze');
    player.tell(`§aYou have frozen §6${victim.name}`);
    victim.tell('§cYou have been frozen');
});
new ST('INFO').onHit(({ player, victim }) => viewStats(player, victim));
console.warn('A');
new ST('KILL').onHit(({ player, victim }) => {
    player.tell(`§eYou have killed ${victim.name}!`);
    victim.kill();
});
console.warn('B');
new ST('SMITE').onHit(({ victim }) => {
    const { x, y, z } = victim.location;
    victim.dimension.spawnEntity("minecraft:lightning_bolt", new Location(x, y, z));
    setTickTimeout(() => victim.runCommandAsync('fill ~5~~5 ~-5~~-5 air 0 replace minecraft:fire'), 10);
});
console.warn('C');
