import { Player, world } from "@minecraft/server";
import { getStId } from "../extras/Utils";
export const StaffTools = {};
export class ST {
    constructor(id) {
        if (!StaffTools[id])
            StaffTools[id] = { id };
        this.id = id;
    }
    onHit(callback) {
        StaffTools[this.id].hit = callback;
    }
    onRightClick(callback) {
        StaffTools[this.id].rightClick = callback;
    }
    onRightClickOn(callback) {
        StaffTools[this.id].rightClickBlock = callback;
    }
    onBlockBreak(callback) {
        StaffTools[this.id].blockBreak = callback;
    }
}
world.events.entityHit.subscribe(({ entity, hitEntity }) => {
    if (!(entity instanceof Player) || !(hitEntity instanceof Player))
        return;
    const inv = entity.getComponent('inventory').container;
    const item = inv.getItem(entity.selectedSlot);
    if (!item)
        return;
    const StId = getStId(item) ?? null;
    if (StaffTools[StId]?.hit)
        StaffTools[StId].hit({ player: entity, victim: hitEntity, item, StId });
});
world.events.beforeItemUse.subscribe(({ source, item, }) => {
    if (!(source instanceof Player))
        return;
    const StId = getStId(item) ?? null;
    if (StaffTools[StId]?.rightClick)
        StaffTools[StId]?.rightClick({ player: source, item, StId });
});
world.events.beforeItemUseOn.subscribe(({ source, item, blockLocation }) => {
    if (!(source instanceof Player))
        return;
    const StId = getStId(item) ?? null;
    if (StaffTools[StId]?.rightClickBlock)
        StaffTools[StId]?.rightClickBlock({ player: source, item, block: source.dimension.getBlock(blockLocation), blockLocation, StId });
});
world.events.blockBreak.subscribe(({ player, block, brokenBlockPermutation }) => {
    const inv = player.getComponent('inventory').container;
    const item = inv.getItem(player.selectedSlot);
    if (!item)
        return;
    const StId = getStId(item) ?? null;
    if (StaffTools[StId]?.blockBreak)
        StaffTools[StId]?.blockBreak({ player, block, brokenBlockPermutation, StId });
});
