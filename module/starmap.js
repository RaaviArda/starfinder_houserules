Hooks.on('init', () => {
    game.settings.register("sfrpg-houserules-raavi", "migratedMainData", {
        name: "Migrated main data",
        hint: "If disabled all main data will be re-migrated",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });

    settingsToRegister.forEach((s) => {
        game.settings.register("sfrpg-houserules-raavi", s.setting, {
            name: s.setting,
            hint: s.setting,
            scope: "world",
            config: false,
            default: s.default,
            type: s.type,
            onChange: async (value) => await updateLocalData(s.setting, value)
        });
    });
});

async function updateLocalData(type, value) {
    if (type === "calendarDate") {
        localData[type] = new Date(value);
        calDisp.updateDisplay();
    } else if (type === "starshipResources") {
        localData[type] = value;
        resDisp.updateDisplay();
    } else if (type === "starmapSystems" || type === "starmapPlanets" || type === "starmapConnections" || type === "currentSystem") {
        localData[type] = value;
        await refreshMap();
    } else {
        localData[type] = value;
    }
}

Hooks.once("ready", async () => {
    if (game.user.isGM) {
        if (!game.settings.get("sfrpg-houserules-raavi", "migratedMainData")) {
            await migrateFromFlagsToSettings();
            await game.settings.set("sfrpg-houserules-raavi", "migratedMainData", true);
        }
    }

    await loadData();
    await updateNoteContents();

    resDisp = new Resources();
    resDisp.isOpen = false;
    resDisp.loadSettings();
    await resDisp.toggleResources();

    calDisp = new Calendar();
    calDisp.isOpen = false;
    calDisp.loadSettings();
    await calDisp.toggleCalendar();

    mapOpen = false;
});

Hooks.on('renderResources', () => {
    resDisp.updateDisplay();
});

Hooks.on('renderCalendar', () => {
    calDisp.updateDisplay();
});

const localData = {};

var starMapCanvas;
var starMapCoords;
var starMapSysName;
var starMapFuelCost;
var starMapCreditCost;
var selSysX;
var selSysY;
var calDisp;
var resDisp;
var mapOpen;

// Main stuff
async function makeMap() {
    let dialogContent = await renderTemplate(
        "modules/sfrpg-houserules-raavi/templates/starmap.html", {}
    );

    // Create dialog
    let starmapDialog = new Dialog({
            title: `Starmap`,
            content: dialogContent,
            buttons: {
                yes: {
                    icon: "<i class='fas fa-check'></i>",
                    label: "Close"
                }
            },
            default: "yes",
            render: () => createStarMapCanvas(),
            close: () => {
                mapOpen = false;
            }
        },
        {
            width: 1100
        });
    starmapDialog.render(true);
    mapOpen = true;
}

async function showSystem(systemId) {
    let systemToShow = localData.starmapSystems.find((s) => s.id === systemId);
    let planetsInSystem;

    let template;
    let systemTypeDisp = HRTABLES.starTypes[systemToShow.type];
    if (game.user.isGM) {
        planetsInSystem = localData.starmapPlanets.filter((p) => p.systemId === systemId);
        template = "modules/sfrpg-houserules-raavi/templates/system-gm.html";
    } else {
        if (systemToShow.known === 2) {
            planetsInSystem = localData.starmapPlanets.filter((p) => p.systemId === systemId && p.known > 0);
        } else {
            planetsInSystem = [];
        }
        template = "modules/sfrpg-houserules-raavi/templates/system-user.html";
    }

    let planetsDisplay = [];
    planetsInSystem.forEach((p) => {
        let newPlanet = JSON.parse(JSON.stringify(p));
        if (p.specials !== undefined && p.specials !== null && p.specials.length > 0 && p.specials[0] !== "BRAK") {
            if (p.known < 2 && !game.user.isGM) {
                newPlanet.specials = ["???"];
            }
        }
        newPlanet.years = Math.sqrt(Math.pow(newPlanet.orbit, 3)).toFixed(2);
        newPlanet.type = HRTABLES.planetTypes[p.type];
        newPlanet.atmosphere = HRTABLES.atmosTypes[p.atmosphere];
        planetsDisplay.push(newPlanet);
    });

    let dialogContent = await renderTemplate(template,
        {
            planets: planetsDisplay,
            system: systemToShow,
            sysDisp: systemTypeDisp
        });

    let dialogButtons;

    if (game.user.isGM) {
        dialogButtons = {
            close: {
                icon: "<i class='fas fa-check'></i>",
                label: "Close"
            },
            moveCost: {
                icon: "<i class='fas fa-space-shuttle'></i>",
                label: "Move (COST)",
                callback: () => {
                    moveShip(systemId, true, false);
                }
            },
            moveDirect: {
                icon: "<i class='fas fa-space-shuttle'></i>",
                label: "Move (DIRECT)",
                callback: () => {
                    moveShip(systemId, true, true);
                }
            },
            moveFree: {
                icon: "<i class='fas fa-space-shuttle'></i>",
                label: "Move (FREE)",
                callback: () => {
                    moveShip(systemId, false, false);
                }
            },
            exploreFull: {
                icon: "<i class='fas fa-eye'></i>",
                label: "Explore",
                callback: () => {
                    exploreSystem(systemId, 2);
                }
            },
            exploreShow: {
                icon: "<i class='fas fa-low-vision'></i>",
                label: "Show",
                callback: () => {
                    exploreSystem(systemId, 1);
                }
            },
            exploreHide: {
                icon: "<i class='fas fa-eye-slash'></i>",
                label: "Hide",
                callback: () => {
                    exploreSystem(systemId, 0);
                }
            },
            probeAll: {
                icon: "<i class='fas fa-satellite'></i>",
                label: "Probe ALL",
                callback: () => {
                    probeSystem(systemId, true);
                }
            },
            probeFree: {
                icon: "<i class='fas fa-satellite-dish'></i>",
                label: "Probe FREE",
                callback: () => {
                    probeSystem(systemId, false);
                }
            }
        }
    } else {
        dialogButtons = {
            close: {
                icon: "<i class='fas fa-check'></i>",
                label: "Close"
            }
        }
    }

    // Create dialog
    let systemDialog = new Dialog({
            title: 'System ' + systemToShow.name,
            content: dialogContent,
            buttons: dialogButtons,
            default: "close"
        },
        {
            width: 1100
        });
    systemDialog.render(true);
}

async function exploreSystem(systemId, level) {
    if (game.user.isGM) {
        let modSys = localData.starmapSystems.find((s) => s.id === systemId);
        modSys.known = level;
        if (level < 2) {
            let planetsInSystem = localData.starmapPlanets.filter((p) => p.systemId === systemId);
            planetsInSystem.forEach((p) => {
                p.known = 1;
            });
        }
        await updateKnownConnections();
        await updateDataInSettings("starmapSystems", localData.starmapSystems);
        await updateDataInSettings("starmapPlanets", localData.starmapPlanets);
        await updateNoteContents();
    }
}

async function moveShip(systemId, cost, direct) {
    if (game.user.isGM) {
        if (cost) {
            if (direct) {
                let newSys = localData.starmapSystems.find((s) => s.id === systemId);
                let fuelCost = calcFuel(localData.currentSystem, newSys, false, 2);
                let distance = calcDistanceLY(localData.currentSystem, newSys);
                if (fuelCost > localData.starshipResources.fuel.value) {
                    ui.notifications.error("Jump fuel cost " + fuelCost + " is above available fuel");
                    return;
                }
                if (distance > localData.jumpRange) {
                    ui.notifications.error("Jump is above maximum jump range");
                    return;
                }
                await performMoveShip(newSys, fuelCost, 0);
            } else {
                let jumpResult = calcRouteToSystem(systemId, false);
                if (jumpResult.fuel > localData.starshipResources.fuel.value) {
                    ui.notifications.error("Jump fuel cost " + jumpResult.fuel + " is above available fuel");
                    return;
                }
                if (jumpResult.credits > localData.starshipResources.credits.value) {
                    ui.notifications.error("Jump credits cost " + jumpResult.credits + " is above available credits");
                    return;
                }
                if (jumpResult.aboveMax) {
                    ui.notifications.error("At least one jump is above maximum jump range");
                    return;
                }
                let newSys = localData.starmapSystems.find((s) => s.id === systemId);
                await performMoveShip(newSys, jumpResult.fuel, jumpResult.credits);
            }
        } else {
            let newSys = localData.starmapSystems.find((s) => s.id === systemId);
            await performMoveShip(newSys, 0, 0);
        }
    }
}

async function performMoveShip(newSys, fuelCost, creditsCost) {
    await exploreSystem(newSys.id, 2);
    localData.currentSystem = newSys;
    if (fuelCost > 0 || creditsCost > 0) {
        localData.starshipResources.fuel.value -= fuelCost;
        localData.starshipResources.credits.value -= creditsCost;
        await updateDataInSettings("starshipResources", localData.starshipResources);
    }

    await updateDataInSettings("currentSystem", localData.currentSystem);
    await updateNoteContents();
}

async function probeSystem(systemId, all) {
    if (game.user.isGM) {
        let planetsInSystem = localData.starmapPlanets.filter((p) => p.systemId === systemId);
        planetsInSystem.forEach((p) => {
            if (p.specials === undefined || p.specials === null || p.specials === "" || (all && localData.starshipResources.probes > 0)) {
                localData.starshipResources.probes = parseInt(localData.starshipResources.probes) - probePlanet(p);
            }
        });
        await updateDataInSettings("starmapPlanets", localData.starmapPlanets);
        await updateDataInSettings("starshipResources", localData.starshipResources);
        await updateNoteContents();
    }
}

function probePlanet(planet) {
    if (game.user.isGM && planet.known < 2) {
        planet.known = 2;
        if (planet.specials !== undefined && planet.specials !== null && planet.specials !== "") {
            if (planet.type === 5) {
                let roll = new Roll("1d20");
                roll.evaluate();
                if (roll.total < 11) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                return 1;
            }
        }
        return 0;
    }
    return 0;
}

async function editPlanet(planetId) {
    let planetToEdit = localData.starmapPlanets.find((p) => p.planetId === planetId);

    let dialogContent = await renderTemplate("modules/sfrpg-houserules-raavi/templates/planet-editor.html",
                {
                    planet: planetToEdit,
                    types: HRTABLES.planetTypes,
                    atmospheres: HRTABLES.atmosTypes
                });

    let update = false;
    new Dialog({
        title: `Edit planet`,
        content: dialogContent,
        buttons: {
            yes: {
                icon: "<i class='fas fa-check'></i>",
                label:"Update",
                callback: () => (update = true),
            },
            no: {
                icon: "<i class='fas fa-times'></i>",
                label: "Cancel",
                callback: () => (update = false),
            }
        },
        default: "yes",
        close: async (html) => {
            if (update) {
                await updatePlanet(html);
            }
        }
    }).render(true);
}

async function updatePlanet(html) {
    let planetId = parseInt(html.find('[id=planet-id]')[0].value);
    let planetToEdit = localData.starmapPlanets.find((p) => p.planetId === planetId);

    if (planetToEdit !== undefined && planetToEdit !== null) {
        let planetName = html.find('[id=planet-name]')[0].value;
        let planetType = parseInt(html.find('[id=planet-type]')[0].value);
        let planetOrbit = parseFloat(html.find('[id=planet-orbit]')[0].value);
        let planetCycle = parseFloat(html.find('[id=planet-cycle]')[0].value);
        let planetRadius = parseFloat(html.find('[id=planet-radius]')[0].value);
        let planetGravity = parseFloat(html.find('[id=planet-gravity]')[0].value);
        let planetAtmosphere = parseInt(html.find('[id=planet-atmosphere]')[0].value);
        let planetOrg = parseInt(html.find('[id=planet-organics]')[0].value);
        let planetMet = parseInt(html.find('[id=planet-metals]')[0].value);
        let planetEne = parseInt(html.find('[id=planet-energy]')[0].value);
        let planetExo = parseInt(html.find('[id=planet-exotic]')[0].value);
        let planetSpecials = html.find('[id=planet-specials]')[0].value;
        let planetGmNotes = html.find('[id=planet-gmNotes]')[0].value;

        if (planetSpecials === undefined || planetSpecials === null || planetSpecials === "") {
            planetSpecials = ["BRAK"];
        } else {
            planetSpecials = planetSpecials.split(",");
        }

        if (planetType !== planetToEdit.type) {
            planetToEdit.type = planetType;
            if (planetType < 5) {
                let roll = new Roll("1d5");
                roll.evaluate();
                planetToEdit.image = "modules/sfrpg-houserules-raavi/images/planets/Planet-" + HRTABLES.planetImgPrefixes[planetType] + roll.total + ".png";
            } else if (planetType < 8) {
                let roll = new Roll("1d3");
                roll.evaluate();
                planetToEdit.image = "modules/sfrpg-houserules-raavi/images/planets/Planet-" + HRTABLES.planetImgPrefixes[planetType] + roll.total + ".png";
            } else {
                planetToEdit.image = "modules/sfrpg-houserules-raavi/images/planets/Planet-Rainbow1.png"
            }
        }

        planetToEdit.name = planetName;
        planetToEdit.orbit = planetOrbit;
        planetToEdit.cycle = planetCycle;
        planetToEdit.radius = planetRadius;
        planetToEdit.gravity = planetGravity;
        planetToEdit.atmosphere = planetAtmosphere;
        planetToEdit.organics = planetOrg;
        planetToEdit.metals = planetMet;
        planetToEdit.energy = planetEne;
        planetToEdit.exotic = planetExo;
        planetToEdit.specials = planetSpecials;
        planetToEdit.gmNotes = planetGmNotes;

        await updateDataInSettings("starmapPlanets", localData.starmapPlanets);
        await updateNoteContents();
    }
}

async function updateDataInSettings(type, data) {
    let contents = game.settings.get("sfrpg-houserules-raavi", type);
    let oldData = "";
    if (contents !== undefined) {
        oldData = JSON.parse(JSON.stringify(contents));
    }
    if (contents === undefined || oldData !== data) {
        await game.settings.set("sfrpg-houserules-raavi", type, data);
    }
}

async function getDataFromSettings(type) {
    if (game.settings.get("sfrpg-houserules-raavi", type) === undefined || game.settings.get("sfrpg-houserules-raavi", type) === null) {
        await game.settings.set("sfrpg-houserules-raavi", type, DEFAULT[type]);
        return JSON.parse(JSON.stringify(DEFAULT[type]));
    }
    return JSON.parse(JSON.stringify(game.settings.get("sfrpg-houserules-raavi", type)));
}

async function loadData() {
    localData.starmapSystems =        await getDataFromSettings("starmapSystems");
    localData.starmapPlanets =        await getDataFromSettings("starmapPlanets");
    localData.starmapConnections =    await getDataFromSettings("starmapConnections");
    localData.jumpCost =              await getDataFromSettings("jumpCost");
    localData.jumpRange =             await getDataFromSettings("jumpRange");
    localData.currentSystem =         await getDataFromSettings("currentSystem");
    localData.starshipResources =     await getDataFromSettings("starshipResources");
    localData.calendarDate = new Date(await getDataFromSettings("calendarDate"));
    localData.fuelPerHour =           await getDataFromSettings("fuelPerHour");
    localData.foodPerDay =            await getDataFromSettings("foodPerDay");

    if (game.user.isGM) {
        await convertStarmapPlanets();
    }
}

async function migrateFromFlagsToSettings() {
    let note = game.journal.entities.find((j) => j.data.name === "Starmap");

    localData.starmapSystems =        await getOldFlagAndUnset(note, "starmapSystems");
    localData.starmapPlanets =        await getOldFlagAndUnset(note, "starmapPlanets");
    localData.starmapConnections =    await getOldFlagAndUnset(note, "starmapConnections");
    localData.jumpCost =              await getOldFlagAndUnset(note, "jumpCost");
    localData.jumpRange =             await getOldFlagAndUnset(note, "jumpRange");
    localData.currentSystem =         await getOldFlagAndUnset(note, "currentSystem");
    localData.starshipResources =     await getOldFlagAndUnset(note, "starshipResources");
    localData.calendarDate = new Date(await getOldFlagAndUnset(note, "calendarDate"));
    localData.fuelPerHour =           await getOldFlagAndUnset(note, "fuelPerHour");
    localData.foodPerDay =            await getOldFlagAndUnset(note, "foodPerDay");

    await convertStarmapPlanets();
}

async function getOldFlagAndUnset(note, type) {
    let flag = note.getFlag("sfrpg-houserules-raavi", type);
    if (flag !== undefined  && flag !== null) {
        let result = JSON.parse(JSON.stringify(flag));
        await note.unsetFlag("sfrpg-houserules-raavi", type);
        await updateDataInSettings(type, result);
        return result;
    } else {
        await updateDataInSettings(type, DEFAULT[type]);
        return JSON.parse(JSON.stringify(DEFAULT[type]));
    }
}

async function updateNoteContents() {
    let note = game.journal.entities.find((j) => j.data.name === "Starmap");
    let template = "modules/sfrpg-houserules-raavi/templates/note-content.html";
    let systemsToShow = [];
    localData.starmapSystems.forEach(sys => {
        if (sys.known > 0) {
            let planetsInSystem = localData.starmapPlanets.filter((p) => p.systemId === sys.id);
            let resourcesInSystem = ["❌", "❌", "❌", "❌"];
            let specialsInSystem = 0;
            let planetsInSystemTotal = planetsInSystem.length;
            let sysOwner = "❓";
            let sysOwnerColor = "#FFFFFF";
            if (sys.known === 2) {
                sysOwner = HRTABLES.raceNames[sys.owner];
                sysOwnerColor = "#" + HRTABLES.starmapColors[sys.owner];
                planetsInSystem.forEach((p) => {
                    if (p.known > 0) {
                        if (p.organics > 0) {
                            resourcesInSystem[0] = "✅";
                        }
                        if (p.metals > 0) {
                            resourcesInSystem[1] = "✅";
                        }
                        if (p.energy > 0) {
                            resourcesInSystem[2] = "✅";
                        }
                        if (p.exotic > 0) {
                            resourcesInSystem[3] = "✅";
                        }
                        let specialsOnPlanet = p.specials;
                        specialsInSystem = specialsInSystem + (specialsOnPlanet.length - 1);
                    }
                });
            } else {
                resourcesInSystem = ["❓", "❓", "❓", "❓"];
                specialsInSystem = "❓";
                planetsInSystemTotal = "❓";
            }
            let resourcesToShow = ["ORG: " + resourcesInSystem[0], "MET: " + resourcesInSystem[1], "ENE: " + resourcesInSystem[2], "EGZ: " + resourcesInSystem[3]];
            let exploreToShow = "Nieznany";
            if (sys.known === 1) {
                exploreToShow = "Czesciowa";
            } else if (sys.known === 2) {
                exploreToShow = "Pelna";
            }
            let singleSystem = {
                id: sys.id,
                name: sys.name,
                cx: sys.cx,
                cy: sys.cy,
                owner: sysOwner,
                ownerColor: sysOwnerColor,
                planets: planetsInSystemTotal,
                resources: resourcesToShow,
                explore: exploreToShow,
                specials: specialsInSystem
            };
            systemsToShow.push(singleSystem);
        }
    });
    let newContent = await renderTemplate(template, {systems: systemsToShow});
    await note.update({"content": newContent});
}

function generateRouteTable(systems) {
    let result = {};
    systems.forEach((s) => {
        let costs = {};
        s.conn.forEach((cn) => {
            let sys = systems.find((osys) => osys.id === cn);
            if (sys !== undefined) {
                costs[cn] = calcFuel(s, sys, true, 1);
            }
        });
        result[s.id] = costs;
    });
    return result;
}

function calcFuel(sys1, sys2, ignoreOwner, modifier) {
    if (!ignoreOwner && sys1.owner !== 0 && sys2.owner !== 0 && (sys1.owner === sys2.owner || sys1.contestant === sys2.owner || sys1.owner === sys2.contestant)) {
        return 0;
    } else {
        return Math.ceil(calcDistanceLY(sys1, sys2) * localData.jumpCost * modifier);
    }
}

function calcDistanceLY(source, dest) {
    let px = calcDistance(source, dest);
    if (px < 0) {
        return px;
    }
    return px * 0.0412240367845251;
}

function calcDistance(source, dest) {
    let x1 = source.cx / 0.9;
    let y1 = source.cy / 0.9;
    let x2 = dest.cx / 0.9;
    let y2 = dest.cy / 0.9;

    if (x1 === 0 || x2 === 0 || y1 === 0 || y2 === 0) {
        return -1.0;
    }

    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function calcRouteToSystem(sysId, display) {
    let knownSystems = {};
    if (game.user.isGM) {
        knownSystems = localData.starmapSystems;
    } else {
        knownSystems = localData.starmapSystems.filter((s) => s.known > 0);
    }
    let destSystem = knownSystems.find((s) => s.id === sysId);

    if (destSystem === undefined || destSystem === null || sysId === localData.currentSystem.id) {
        return;
    }

    let routePlotted = dijkstra(generateRouteTable(knownSystems), localData.currentSystem.id, destSystem.id);
    let beyondMax = false;

    let sys1 = localData.currentSystem;
    let creditCost = 0;
    let fuelCost = 0;
    routePlotted.path.forEach(node => {
        if (parseInt(node) === localData.currentSystem.id) {
            return;
        }
        let sys2 = knownSystems.find((s) => s.id === parseInt(node));
        let dist = calcDistanceLY(sys1, sys2);
        if (sys1.owner !== 0 && sys2.owner !== 0 && (sys1.owner === sys2.owner || sys1.contestant === sys2.owner || sys1.owner === sys2.contestant)) {
            creditCost = creditCost + HRTABLES.jumpGateCosts[sys2.owner];
            dist = 0;
        } else {
            if (routePlotted.distance !== "Infinity") {
                fuelCost = fuelCost + calcFuel(sys1, sys2, false, 1);
            } else {
                fuelCost = fuelCost + calcFuel(sys1, sys2, false, 2);
            }
        }
        if (dist > localData.jumpRange) {
            beyondMax = true;
        }
        if (display) {
            let line = makeJumpLine([sys1.cx, sys1.cy, sys2.cx, sys2.cy], dist > localData.jumpRange);
            starMapCanvas.add(line);
        }
        sys1 = sys2;
    });
    if (display) {
        starMapFuelCost.text = 'F: ' + fuelCost;
        starMapCreditCost.text = 'C: ' + creditCost;
    }
    return {fuel: fuelCost, credits: creditCost, route: routePlotted, aboveMax: beyondMax};
}

async function renderSystemsGM() {
    localData.starmapSystems.forEach(system => {
        if (system.cx > 0 && system.cy > 0) {
            let contestant = null;
            let owner = "#" + HRTABLES.starmapColors[system.owner];
            if (system.contestant > 0) {
                contestant = HRTABLES.starmapColors[system.contestant];
            }
            let sys;
            if (system.known === 0) {
                sys = makePolygon(system.cx, system.cy, owner, contestant, system.id, system.name, 3);
            } else if (system.known === 1) {
                sys = makePolygon(system.cx, system.cy, owner, contestant, system.id, system.name, 6);
            } else {
                sys = makeCircle(system.cx, system.cy, owner, contestant, system.id, system.name);
            }
            starMapCanvas.add(sys);
        }
    });
}

async function renderJumpLinesGM() {
    localData.starmapConnections.forEach(conn => {
        let colorFill = "#FF00FF";
        if (conn.known) {
            colorFill = "#FFFF00";
        }
        let connection = makeLine([conn.sys1cx, conn.sys1cy, conn.sys2cx, conn.sys2cy], colorFill);
        starMapCanvas.add(connection);
    });
}

async function renderSystemsPlayer() {
    localData.starmapSystems.forEach(system => {
        if (system.cx > 0 && system.cy > 0 && system.known > 0) {
            let contestant = null;
            let owner = "#" + HRTABLES.starmapColors[system.owner];
            if (system.contestant > 0) {
                contestant = HRTABLES.starmapColors[system.contestant];
            }
            let sys;
            if (system.known === 0) {
                sys = makePolygon(system.cx, system.cy, owner, contestant, system.id, system.name, 3);
            } else if (system.known === 1) {
                sys = makePolygon(system.cx, system.cy, "#FFFFFF", null, system.id, "???", 6);
            } else {
                sys = makeCircle(system.cx, system.cy, owner, contestant, system.id, system.name);
            }
            starMapCanvas.add(sys);
        }
    });
}

async function renderJumpLinesPlayer() {
    localData.starmapConnections.forEach(conn => {
        if (conn.known) {
            let connection = makeLine([conn.sys1cx, conn.sys1cy, conn.sys2cx, conn.sys2cy], "#FFFF00");
            starMapCanvas.add(connection);
        }
    });
}

async function updateKnownConnections() {
    localData.starmapConnections.forEach(conn => {
        let sys1 = localData.starmapSystems.find((s) => s.id === conn.sys1);
        let sys2 = localData.starmapSystems.find((s) => s.id === conn.sys2);
        conn.known = sys1.known > 0 && sys2.known > 0;
    });

    await updateDataInSettings("starmapConnections", localData.starmapConnections);
}

async function convertStarmapPlanets() {
    localData.starmapPlanets.forEach((p) => {
        //add image
        if (p.image === undefined || p.image === null) {
            if (p.type < 5) {
                let roll = new Roll("1d5");
                roll.evaluate();
                p.image = "modules/sfrpg-houserules-raavi/images/planets/Planet-" + HRTABLES.planetImgPrefixes[p.type] + roll.total + ".png";
            } else if (p.type < 8) {
                let roll = new Roll("1d3");
                roll.evaluate();
                p.image = "modules/sfrpg-houserules-raavi/images/planets/Planet-" + HRTABLES.planetImgPrefixes[p.type] + roll.total + ".png";
            } else {
                p.image = "modules/sfrpg-houserules-raavi/images/planets/Planet-Rainbow1.png"
            }
        }

        if (p.specials !== undefined && p.specials !== null && p.specials !== "") {
            if (!Array.isArray(p.specials)) {
                p.specials = p.specials.split(";");
            }
        } else {
            p.specials = ["BRAK"];
        }
    });

    await updateDataInSettings("starmapPlanets", localData.starmapPlanets);
}

async function createStarMapCanvas() {
    starMapCanvas = new fabric.Canvas('mapcanvas');
    starMapCanvas.on('mouse:move', function (e) {
        updatestarMapCoords(e);
    });
    starMapCanvas.on('mouse:down', function (e) {
        selectSystem(e);
    });
    generateCanvasContents();

    if (game.user.isGM) {
        await renderSystemsGM();
        await renderJumpLinesGM();
    } else {
        await renderSystemsPlayer();
        await renderJumpLinesPlayer();
    }
}

async function refreshMap() {
    if (!mapOpen) {
        return;
    }
    starMapCanvas.clear();
    generateCanvasContents();

    if (game.user.isGM) {
        await renderSystemsGM();
        await renderJumpLinesGM();
    } else {
        await renderSystemsPlayer();
        await renderJumpLinesPlayer();
    }
}