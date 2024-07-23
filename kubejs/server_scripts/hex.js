// priority: 0

// Visit the wiki for more info - https://kubejs.com
let numberLiterals = {};
let costs = {};

let forceCastQueue = {};

PlayerEvents.chat((e) => {
    let message = e.message.split(" ");
    if (message[0] === 'false') {
        Hexcasting.setPlayerPatternListType(e.entity.uuid, false);
        e.entity.sendSystemMessage("Set list to blacklist");
    } else if (message[0] === 'true') {
        Hexcasting.setPlayerPatternListType(e.entity.uuid, true);
        e.entity.sendSystemMessage("Set list to whitelist");
    } else if (message[0] === 'add') {
        if (message.length < 2) {
            e.entity.sendSystemMessage("Usage1: add <pattern>");
            e.cancel()
            return;
        }
        Hexcasting.addPatternToPlayer(e.entity.uuid, message[1]);
        e.entity.sendSystemMessage("Added pattern to list");
    } else if (message[0] === 'redirect') {
        if (message.length < 3) {
            e.entity.sendSystemMessage("Usage: redirect <from> <to>");
            e.cancel()
            return;
        }
        Hexcasting.addRedirectToPlayer(e.entity.uuid, message[1], message[2]);
        e.entity.sendSystemMessage("Added redirect");
    } else if (message[0] === 'clear') {
        Hexcasting.clearPlayerRedirects(e.entity.uuid);
        Hexcasting.clearPlayerList(e.entity.uuid);
        Hexcasting.clearGlobalRedirects();
        Hexcasting.clearGlobalList();
        Hexcasting.clearCustomPatterns();
    } else if (message[0] === 'addNumberLiteral') {
        if (message.length < 3 || isNaN(message[2])) {
            e.entity.sendSystemMessage("Usage: addNumberLiteral <pattern> <value>");
            e.cancel()
            return;
        }
        Hexcasting.registerCustomPattern("Number literal: " + message[2], message[1], false, false);
        numberLiterals[message[1]] = parseFloat(message[2]);
        e.entity.sendSystemMessage("Added number literal");
    } else if (message[0] === 'cost') {
        if (message.length < 3 || isNaN(message[2])) {
            e.entity.sendSystemMessage("Usage: cost <pattern> <cost>");
            e.cancel()
            return;
        }
        Hexcasting.registerCustomPattern("Cost: " + message[2], message[1], false, false);
        costs[message[1]] = parseFloat(message[2]);
        e.entity.sendSystemMessage("Added cost pattern");

    } else if (message[0] === 'giveCypher') {
        e.entity.give(Hexcasting.createCypher(["qaq", "aa", "qaq", "wa", "wqaawdd", "aqaaww", "aawaawaa"], 100000))
    } else if (message[0] === 'giveScrolls') {
        if (message.length < 3) {
            e.entity.sendSystemMessage("Usage: giveScroll <pattern> <name>");
            e.cancel()
            return;
        }
        // Conjoin all message parts past index 1 as part of name
        let name = message.slice(2).join(" ");
        e.entity.give(Hexcasting.createSmallScroll(name, HexDir.NORTH_EAST, message[1]));
        e.entity.give(Hexcasting.createMediumScroll(name, HexDir.NORTH_EAST, message[1]));
        e.entity.give(Hexcasting.createLargeScroll(name, HexDir.NORTH_EAST, message[1]));
    } else if (message[0] === 'giveAncientScroll') {
        if (message.length < 3) {
            e.entity.sendSystemMessage("Usage: giveAncientScroll <pattern> <lang entry ID>");
            e.cancel()
            return;
        }
        e.entity.give(Hexcasting.createAncientScroll(message[2], HexDir.NORTH_EAST, message[1]));
    } else if (message[0] === 'forceCast') {
        if (message.length < 3) {
            e.entity.sendSystemMessage("Usage: forceCast <playerName> <patterns...> OR forceCast trigger");
            e.cancel()
            return;
        }
        if (message[1] == 'trigger') {
            if (forceCastQueue[message[2]] === undefined) {
                e.entity.sendSystemMessage("No forceCast queue on " + message[2]);
                e.cancel()
            }
            console.log(forceCastQueue[message[2]])
            let queue = forceCastQueue[message[2]];
            forceCastQueue[message[2]] = undefined;
            Hexcasting.forceCastPlayerName(message[2], queue);
            e.cancel();
        }
        if (forceCastQueue[message[1]] === undefined) {
            forceCastQueue[message[1]] = [message[2]];
        } else {
            forceCastQueue[message[1]].push(message[2])
        }
        console.log(Utils.server);
    } else if (message[0] === 'setLength') {
        if (message.length < 2 || isNaN(message[1])) {
            e.entity.sendSystemMessage("Usage: setLength <length>");
            e.cancel()
            return;
        }
        Hexcasting.setPlayerMaxBookkeeperLength(e.entity.uuid, parseInt(message[1]));
        e.entity.sendSystemMessage("Set length to " + message[1]);
    } else if (message[0] === 'blockNumbers') {
        Hexcasting.addPatternToPlayer(e.entity.uuid, "aqaa");
        Hexcasting.addPatternToPlayer(e.entity.uuid, "dedd");
    } else if (message[0] === 'unblockNumbers') {
        Hexcasting.removePatternFromPlayer(e.entity.uuid, "aqaa");
        Hexcasting.removePatternFromPlayer(e.entity.uuid, "dedd");
    } else if (message[0] === 'possessedLevitation') {
        if (message.length < 2) {
            e.entity.sendSystemMessage("Usage: possessedLevitation <possesser>")
        };
        Hexcasting.forceCastPlayerName(message[1], [
            "qaq",
            "aa",
            "eeeeeqw",
            "weaqa",
            "aqaaeea",
            "qqqqqawwawawd"
        ]);
    } else if (message[0] === "spellFragment") {
        if (message.length < 3) {
            e.entity.sendSystemMessage("Usage: spellFragment <name> <patterns...>");
            e.cancel();
            return;
        }

        let name = message[1].replace("_", " ");
        let patterns = message.slice(2);

        e.entity.give(makeSpellFragment(name, patterns));

    } else return;
    e.cancel();
})

Hexcasting.registerCustomPattern("Testing", "deewde", false, false);


/**
 * Now for the sake of example, let's make this pattern do the following things:
- Take the entity at the top of the stack, and turn it into a position 10 blocks above it
- Give the player a one-use cypher to self destruct. (Safely)
- Set the cost of the pattern to 5 amethyst dust
 */

// This event triggers whenever any registered pattern is cast
HexcastingEvents.registeredPatternCastEvent((e) => {
    // You could get the stack after checking what pattern it is,
    // but this is more convenient if you're going to have multiple patterns
    let stack = e.getStack();

    // Check if the pattern is the one we registered earlier
    if (e.getPattern().anglesSignature() == "deewde") {

        e.getCaster().sendSystemMessage("Testing");

        e.getCaster().teleportTo("minecraft")

        // And finish the spell
        e.finish();
    }
});