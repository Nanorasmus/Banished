let spellFragments = [];
let spellFragmentWeights = [];

let spellFragmentsPreWeighed = [];

function addSpellFragment(name, patterns, weight) {
    spellFragments.push(makeSpellFragment(name, patterns).item);
    console.info("Added spell fragment " + spellFragments[spellFragments.length - 1]);
    spellFragmentWeights.push(weight);
}

function getRandoimizedSpellFragment() {
    return weighted_random(spellFragments, spellFragmentWeights);
}

// Basic parts
addSpellFragment("Preperation", ["qaq", "aa", "qaq", "wa"], 50);
addSpellFragment("Scout's Distillation", ["weaqa"], 20);
addSpellFragment("Archer's Distillation", ["wqaawdd"], 20);
addSpellFragment("Architect's Distillation", ["weddwaa"], 20);

// Full spells
addSpellFragment("Explosion I", ["qaq", "aa", "aqaaw", "aawaawaa"])
addSpellFragment("Explosion II", ["qaq", "aa", "aqaawa", "aawaawaa"])
addSpellFragment("Explosion III", ["qaq", "aa", "aqaaedwd", "aawaawaa"])


// Handle loot
LootJS.modifiers((e) => {
    e.addEntityLootModifier("minecraft:zombie").apply((context) => {
        console.info("HUH")
        context.addLoot(Item.of(getRandoimizedSpellFragment()));
        context.forEachLoot((item) => {
            console.info(item)
        })
    })
})