const CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag');
const ItemStack = Java.loadClass('net.minecraft.world.item.ItemStack');
const InteractionHand = Java.loadClass('net.minecraft.world.InteractionHand');
const EquipmentSlot = Java.loadClass('net.minecraft.world.entity.EquipmentSlot');

function makeSpellFragment(name, patterns) {
    if (patterns.length < 2) {
        return makeSpellFragmentWithColor(name, "§f", patterns);
    } else if (patterns.length < 3) {
        return makeSpellFragmentWithColor(name, "§d", patterns);
    } else if (patterns.length < 4) {
        return makeSpellFragmentWithColor(name, "§5", patterns);
    } else if (patterns.length < 5)  {
        return makeSpellFragmentWithColor(name, "§5§l", patterns);
    } else {
        return makeSpellFragmentWithColor(name, "§6§l", patterns);
    }
}

function makeSpellFragmentWithColor(name, color, patterns) {
    let itemStack = Item.getItem("kubejs:spell_fragment").getDefaultInstance();

    let nbt = itemStack.getNbt();
    if (nbt == null) {
        nbt = new CompoundTag();
    }

    // Add all the patterns to NBT and form a spell description simultaneously
    let spellDescription = [];

    nbt.putInt("pattern_count", patterns.length)
    for (let i = 0; i < patterns.length; i++) {
        spellDescription.push("HexPattern(NORTH_EAST " + patterns[i] + ")");
        nbt.putString("pattern_" + i, patterns[i]);
    }

    // Set NBT
    itemStack.setNbt(nbt);

    // Add tooltip
    itemStack.setHoverName(Text.literal(color + "Spell Fragment of §n" + name + color + " (§r" + spellDescription.join(" ") + color + ")"));


    return itemStack;
}


ItemEvents.rightClicked((e) => {
    if (e.item.getId() !== "kubejs:spell_fragment") {
        return;
    }
    
    // Get the patterns of the spell fragment
    let nbt = e.item.getNbt();
    let patterns = [];
    for (let i = 0; i < nbt.getInt("pattern_count"); i++) {
        patterns.push(nbt.getString("pattern_" + i));
    }

    // Cast the spell
    Hexcasting.forceCastPlayerEntity(e.player, patterns);

    // Remove the spell fragment
    let slot = e.player.inventory.findSlotMatchingItem(e.item);
    let stack = e.player.inventory.getItem(slot);
    stack.setCount(stack.getCount() - 1);
    e.player.inventory.setStackInSlot(slot, stack);

    e.cancel()
})