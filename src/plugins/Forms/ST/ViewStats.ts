import { ActionFormData } from "@minecraft/server-ui"
import { Player } from "@minecraft/server"
import { Database } from "../../../lib/Database";

const DB = new Database('PLAYERINFO')
export function viewStats(player: Player, target: Player, status?: string) {
    let data = DB.read(target.id)
    const warns: any[] = data?.warns ?? []
    let msg = `Warns: \n`,
    warnID = 0;
    warns?.forEach(warn => {
        warnID++
        let msg2 = `§cWarnID: ${warnID}\n§7By: §b${warn?.warnnedBy}\n§7Date: §e${warn?.date}\n§7Reason: §6${warn?.reason}\n\n`
        msg += msg2
    })
    new ActionFormData()
    .title(`About §6${target.name}`)
    .body(
        `§7Name: §6${target.name}\n§7ID: §3${target.id}\n§7Health: §e${target.getComponent('health').current}\n§7Pos: §e${Math.floor(target.location.x)} §a${Math.floor(target.location.y)} §b${Math.floor(target.location.z)}\n§7Status: ${target.hasTag('isFreeze') ? '§bFreeze' : '§aUnfreeze'}\n§7Velocity: §b${target.getComponent('movement').current.toFixed(7)}\n\n${warns.length === 0 ? '' : msg}`
        )
        .button('§eOk')
        .show(player).then((res) => {
        if (res.canceled) 
            return;
    })
}