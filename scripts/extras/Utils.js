import { ItemStack, MinecraftEnchantmentTypes, Items, Enchantment, MinecraftItemTypes } from "@minecraft/server";
export const getItemData = (item) => {
    const itemData = {
        id: item.typeId,
        data: item.data,
        amount: item.amount,
        nameTag: item.nameTag,
        lore: item.getLore(),
        enchantments: [],
    };
    if (!item.hasComponent("enchantments"))
        return itemData;
    const enchants = item.getComponent('enchantments')?.enchantments;
    if (enchants) {
        for (let k in MinecraftEnchantmentTypes) {
            //@ts-ignore
            const type = MinecraftEnchantmentTypes[k];
            if (!enchants.hasEnchantment(type))
                continue;
            const enchant = enchants.getEnchantment(type);
            itemData.enchantments.push({
                id: enchant.type.id,
                level: enchant.level,
            });
        }
    }
    return itemData;
};
/**
   * This function allows you to create a new itemStack instance with the data saved with the getItemData function.
   * @param {ItemData} itemData - The data saved to create a new item
   * @returns {itemStack}
*/
export const newItem = (itemData) => {
    const item = new ItemStack(Items.get(itemData.id), itemData.amount, itemData.data);
    item.nameTag = itemData.nameTag;
    item.setLore(itemData.lore);
    const enchComp = item.getComponent("enchantments");
    const enchants = enchComp?.enchantments;
    if (enchants) {
        for (let enchant of itemData.enchantments) {
            const key = enchant.id
                .replace("minecraft:", "")
                .replace(/_(.)/g, (match) => match[1].toUpperCase());
            //@ts-ignore
            const type = MinecraftEnchantmentTypes[key];
            if (!type)
                continue;
            enchants.addEnchantment(new Enchantment(type, enchant.level));
        }
        enchComp.enchantments = enchants;
    }
    return item;
};
export const createItem = (id, { nameTag = undefined, amount = 1, data = 0, lore = [], enchantments = [] }) => {
    if (!Object.values(MinecraftItemTypes).find(item => item.id === id) || !Items.get(id))
        throw Error('This is not a valid item');
    const type = Items.get(id);
    if (!type)
        throw Error('That is not a valid item');
    if (isNaN(amount))
        throw Error('Amount must be a integer');
    const item = new ItemStack(type, amount, data);
    if (nameTag)
        item.nameTag = nameTag;
    if (typeof (lore) === "object")
        item.setLore(lore);
    else if (typeof (lore) === "string") {
        const lr = [];
        lr.push(lore);
        item.setLore(lr);
    }
    if (enchantments && typeof enchantments === 'object' && enchantments.length > 0) {
        const enchComp = item.getComponent('enchantments'), enchants = enchComp?.enchantments;
        if (enchants) {
            for (let enchant of enchantments) {
                //@ts-ignore
                const enchType = MinecraftEnchantmentTypes[enchant.id];
                if (!type)
                    continue;
                enchants.addEnchantment(new Enchantment(enchType, enchant.level));
            }
            enchComp.enchantments = enchants;
        }
        return item;
    }
    return item;
};
/**
 * STAFF TOOLS EXCLUSIVE
 */
/**
 * Give item to a player
 * @param {Player} target
 * @param {ItemStack} item
 */
export const give = (target, item) => {
    const inventory = target.getComponent("inventory").container;
    inventory.addItem(item);
};
/**
* Give many items at once to a player
* @param {Player} target
* @param {Array<ItemStack>} items
*/
export const giveMany = (target, items) => {
    const inventory = target.getComponent("inventory").container;
    for (const item of items) {
        inventory.addItem(item);
    }
};
/**
 *
 * @param {ItemStack} item
 * @param {number} index
 * @returns
 */
export const getStId = (item, index = 1) => item?.getLore()[index]?.split('§')?.slice(4)?.join('');
