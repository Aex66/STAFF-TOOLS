/*
Developers:
Aex66:
Discord: Aex66#0202
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
           _____
          /  _  \   ____ ___  ___
         /  /_\  \_/ __ \\  \/  /
        /    |    \  ___/ >    <
        \____|__  /\___  >__/\_ \
                \/     \/      \/
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
© Copyright 2022 all rights reserved. Do NOT steal, copy the code, or claim it as yours
Thank you
*/
import './plugins/commands/import.js';
import './plugins/ST-EVENTS/import.js';
import { world, Location } from "@minecraft/server";
import { StaffTools } from "./lib/Stafftools.js";
world.events.tick.subscribe(() => {
    for (const player of world.getPlayers()) {
        const freeze = player.getTags().find((x) => x.startsWith('ST-Freeze:'))?.substring(10) ?? null;
        if (freeze) {
            const Loc = freeze.split(',');
            player.teleport(new Location(Number(Loc[0]), Number(Loc[1]), Number(Loc[2])), world.getDimension(Loc[3]), player.rotation.x, player.rotation.y);
        }
    }
});
console.warn(JSON.stringify(StaffTools));
