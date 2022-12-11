import { ST } from "../../lib/Stafftools.js";
import { world, Location, MinecraftEffectTypes } from "@minecraft/server"
import { createItem } from "../../extras/Utils";

new ST('RANDOM-TELEPORT').onRightClick(({ player, item }) => {
  const allNames = Array.from(world.getPlayers(), (plr) => plr.name)
  allNames.splice(allNames.indexOf(player.name), 1)

  if (!allNames.length) allNames.push('Undefined')

  const random = allNames[Math.floor(Math.random() * allNames.length)]
  if (random === 'Undefined') return player.tell('§cThere are no players online in your server')
  const target = [...world.getPlayers()].find(player => player.name == random || player.nameTag == random)
  
  const  { x, y, z } = target.location
  player.teleport(new Location(x, y, z), player.dimension, player.rotation.x, player.rotation.y)
})

new ST('KILL').onRightClick(({ player }) => {
  /**
  * Smite ST
  */
  const smite = createItem('minecraft:blaze_rod', {
    nameTag: "§➥§l§cSmite",
    lore: ['§➥§l§eStaff§btools', '§' + ['I', 'D', ':', 'SMITE'.split('').join('§')].join('§'), '§7Hint: Hit the player while holding', '§7to smite them']
  })
  const inv = player.getComponent("inventory").container
  inv.setItem(player.selectedSlot, smite)
})

new ST('SMITE').onRightClick(({ player }) => {
  /**
  * Kill player ST
  */
   const kill = createItem('minecraft:barrier', {
    nameTag: "§➥§l§cKill",
    lore: ['§➥§l§eStaff§btools', '§' + ['I', 'D', ':', 'KILL'.split('').join('§')].join('§'), '§7Hint: Hit the player while holding', '§7to kill them']
  })
  const inv = player.getComponent("inventory").container
  inv.setItem(player.selectedSlot, kill)
})

new ST('VANISH').onRightClick( async ({ player }) => {
    if (player.hasTag('isVanish')) {
        try {
            await player.runCommandAsync("effect @s clear")
        } catch {}
        player.triggerEvent("unvanish")
        player.tell('§aVanish §cOFF')
        return player.removeTag("isVanish")
    }
    
    player.addEffect(MinecraftEffectTypes.invisibility, 9999999, 255, false)
    player.addEffect(MinecraftEffectTypes.nightVision, 9999999, 255, false)
    player.triggerEvent("vanish")
    player.tell('§aVanish ON')
    player.addTag("isVanish")
})