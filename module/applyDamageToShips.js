Hooks.on("getChatLogEntryContext", addShipDamageContextOptions);

async function addShipDamageContextOptions (html, options) {
    let canApply = li => canvas.tokens.controlled.length && li.find(".dice-roll").length;
    options.push(
        {
            name: "Apply Damage to Ship (NORMAL)",
            icon: "<i class='fas fa-user-minus'></i>",
            condition: canApply,
            callback: li => applyShipDamage(li, 1, 1)
        },
        {
            name: "Apply Damage to Ship (EMP/KINETIC)",
            icon: "<i class='fas fa-user-minus'></i>",
            condition: canApply,
            callback: li => applyShipDamage(li, 2, 1)
        },
        {
            name: "Apply Damage to Ship (EMP)",
            icon: "<i class='fas fa-user-minus'></i>",
            condition: canApply,
            callback: li => applyShipDamage(li, 2, 0.5)
        },
        {
            name: "Apply Damage to Ship (EXPLOSIVE)",
            icon: "<i class='fas fa-user-minus'></i>",
            condition: canApply,
            callback: li => applyShipDamage(li, 0.5, 2)
        }
    );

    return options;
}

async function applyShipDamage(roll, shMult, hullMult) {
    let total = parseFloat(roll.find('.dice-total').text());
    const promises = [];
    for (let t of canvas.tokens.controlled) {
        if (t.actor.data.type !== "starship") {
            ui.notifications.warn("This function is for applying damage to ships only");
            continue;
        }

        let a = t.actor,
            hp = a.data.data.attributes.hp,
            sp = a.data.data.attributes.shields.forward,
            dt = a.data.data.attributes.damageThreshold.value;

        let hpd = hp.value;
        let spd = sp.value;

        let shieldDam = Math.floor(total * shMult);
        if (shieldDam <= spd) {
            spd = spd - shieldDam;
        } else {
            shieldDam = shieldDam - spd;
            spd = 0;
            let remainDam = Math.floor(shieldDam / shMult);
            let hullDam = Math.floor(remainDam * hullMult);
            if (hullDam > dt) {
                hpd = hpd - hullDam;
                if (hpd < 0) {
                    hpd = 0;
                }
            }
        }

        promises.push(t.actor.update({
            "data.attributes.hp.value": hpd,
            "data.attributes.shields.forward.value": spd
        }));
    }

    return Promise.all(promises);
}