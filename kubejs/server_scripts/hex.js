// priority: 0

// Visit the wiki for more info - https://kubejs.com
let numberLiterals = {};
let costs = {};

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
    } else if (message[0] === 'forceCast') {
        if (message.length < 3) {
            e.entity.sendSystemMessage("Usage: forceCast <playerName> <pattern> OR forceCast trigger");
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
    };
    e.cancel();
})

HexcastingEvents.patternCastedEvent((e) => {
    let stack = e.getStack();
    
    if (numberLiterals[e.getPattern().anglesSignature()] !== undefined) {
        stack.add(new DoubleIota(numberLiterals[e.getPattern().anglesSignature()]));
    }
    if (costs[e.getPattern().anglesSignature()] !== undefined) {
        e.setCost(costs[e.getPattern().anglesSignature()]);
    }
    if (numberLiterals[e.getPattern().anglesSignature()] === undefined && costs[e.getPattern().anglesSignature()] === undefined) {
        stack.add(new NullIota());
    }
    e.finish();
})