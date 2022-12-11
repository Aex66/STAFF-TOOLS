import { ST } from "../../lib/Stafftools.js";
import { Location } from "@minecraft/server";
new ST('CLICK-TELEPORT').onRightClickOn(({ player, blockLocation }) => {
    const { x, y, z } = blockLocation;
    player.teleport(new Location(x, y + 1, z), player.dimension, player.rotation.x, player.rotation.y);
});
