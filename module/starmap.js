Hooks.once("ready", async () => {
    let note = game.journal.entities.find((j) => j.data.name === "Starmap");
    if (game.user.isGM) {
        let defaultResources = {
            credits: {value: 0, max: 0},
            mcredits: {value: 0, max: 0},
            cap: {value: 0, max: 0},
            fuel: {value: 0, max: 0},
            org: {value: 0, max: 0},
            met: {value: 0, max: 0},
            ene: {value: 0, max: 0},
            exo: {value: 0, max: 0},
            probes: {value: 0, max: 0},
            food: {value: 0, max: 0}
        };
        starmapSystems =        await getNoteContents(note, "starmapSystems", CONFIG.SFRPG.starmapSystems);
        starmapPlanets =        await getNoteContents(note, "starmapPlanets", CONFIG.SFRPG.starmapPlanets);
        starmapConnections =    await getNoteContents(note, "starmapConnections", CONFIG.SFRPG.starmapConnections);
        jumpCost =              await getNoteContents(note, "jumpCost", 10);
        jumpRange =             await getNoteContents(note, "jumpRange", 6);
        currentSystem =         await getNoteContents(note, "currentSystem", {id: 0, cx: 183, cy: 244, owner: 0});
        starshipResources =     await getNoteContents(note, "starshipResources", defaultResources);
        calendarDate = new Date(await getNoteContents(note, "calendarDate", "2185-05-04 22:00:00"));
        fuelPerHour =           await getNoteContents(note, "fuelPerHour", 1);
        foodPerDay =            await getNoteContents(note, "foodPerDay", 5);
    }
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

Hooks.on('updateJournalEntry', (journal, data, opts, userId) => {
    if (journal.data.name === "Starmap" && userId !== game.userId) {
        let note = game.journal.entities.find((j) => j.data.name === "Starmap");
        starmapSystems = note.getFlag("sfrpg-houserules-raavi", "starmapSystems");
        starmapPlanets = note.getFlag("sfrpg-houserules-raavi", "starmapPlanets");
        starmapConnections = note.getFlag("sfrpg-houserules-raavi", "starmapConnections");
        jumpCost = note.getFlag("sfrpg-houserules-raavi", "jumpCost");
        currentSystem = note.getFlag("sfrpg-houserules-raavi", "currentSystem");
        starshipResources = note.getFlag("sfrpg-houserules-raavi", "starshipResources");
        refreshMap();
        resDisp.updateDisplay();
        calDisp.updateDisplay();
    }
});

var starmapSystems;
var starmapPlanets;
var starmapConnections;
var jumpCost;
var currentSystem;
var starshipResources;
var jumpRange;
var calendarDate;
var fuelPerHour;
var foodPerDay;

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
    let systemToShow = starmapSystems.find((s) => s.id === systemId);
    let planetsInSystem;

    let template;
    let systemTypeDisp = CONFIG.SFRPG.starTypes[systemToShow.type];
    if (game.user.isGM) {
        planetsInSystem = starmapPlanets.filter((p) => p.systemId === systemId);
        template = "modules/sfrpg-houserules-raavi/templates/system-gm.html";
    } else {
        if (systemToShow.known === 2) {
            planetsInSystem = starmapPlanets.filter((p) => p.systemId === systemId && p.known > 0);
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
        newPlanet.type = CONFIG.SFRPG.planetTypes[p.type];
        newPlanet.atmosphere = CONFIG.SFRPG.atmosTypes[p.atmosphere];
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
        let modSys = starmapSystems.find((s) => s.id === systemId);
        modSys.known = level;
        if (level < 2) {
            let planetsInSystem = starmapPlanets.filter((p) => p.systemId === systemId);
            planetsInSystem.forEach((p) => {
                p.known = 1;
            });
        }
        await updateKnownConnections();
        await updateNote("starmapSystems", starmapSystems);
        await updateNote("starmapPlanets", starmapPlanets);
        await updateNoteContents();
        await refreshMap();
    }
}

async function moveShip(systemId, cost, direct) {
    if (game.user.isGM) {
        if (cost) {
            if (direct) {
                let newSys = starmapSystems.find((s) => s.id === systemId);
                let fuelCost = calcFuel(currentSystem, newSys, false, 2);
                let distance = calcDistanceLY(currentSystem, newSys);
                if (fuelCost > starshipResources.fuel.value) {
                    ui.notifications.error("Jump fuel cost " + fuelCost + " is above available fuel");
                    return;
                }
                if (distance > jumpRange) {
                    ui.notifications.error("Jump is above maximum jump range");
                    return;
                }
                await performMoveShip(newSys, fuelCost, 0);
            } else {
                let jumpResult = calcRouteToSystem(systemId, false);
                if (jumpResult.fuel > starshipResources.fuel.value) {
                    ui.notifications.error("Jump fuel cost " + jumpResult.fuel + " is above available fuel");
                    return;
                }
                if (jumpResult.credits > starshipResources.credits.value) {
                    ui.notifications.error("Jump credits cost " + jumpResult.credits + " is above available credits");
                    return;
                }
                if (jumpResult.aboveMax) {
                    ui.notifications.error("At least one jump is above maximum jump range");
                    return;
                }
                let newSys = starmapSystems.find((s) => s.id === systemId);
                await performMoveShip(newSys, jumpResult.fuel, jumpResult.credits);
            }
        } else {
            let newSys = starmapSystems.find((s) => s.id === systemId);
            await performMoveShip(newSys, 0, 0);
        }
    }
}

async function performMoveShip(newSys, fuelCost, creditsCost) {
    newSys.known = 2;
    currentSystem = newSys;
    if (fuelCost > 0 || creditsCost > 0) {
        starshipResources.fuel.value = starshipResources.fuel.value - fuelCost;
        starshipResources.credits.value = starshipResources.credits.value - creditsCost;
        await updateNote("starshipResources", starshipResources);
        resDisp.updateDisplay();
    }
    await updateKnownConnections();
    await updateNote("starmapSystems", starmapSystems);
    await updateNote("currentSystem", currentSystem);
    await updateNoteContents();
    await refreshMap();
}

async function probeSystem(systemId, all) {
    if (game.user.isGM) {
        let planetsInSystem = starmapPlanets.filter((p) => p.systemId === systemId);
        planetsInSystem.forEach((p) => {
            if (p.specials === undefined || p.specials === null || p.specials === "" || (all && starshipResources.probes > 0)) {
                starshipResources.probes = parseInt(starshipResources.probes) - probePlanet(p);
            }
        });
        await updateNote("starmapPlanets", starmapPlanets);
        await updateNote("starshipResources", starshipResources);
        await updateNoteContents();
        await refreshMap();
        resDisp.updateDisplay();
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
    let planetToEdit = starmapPlanets.find((p) => p.planetId === planetId);

    let dialogContent = await renderTemplate("modules/sfrpg-houserules-raavi/templates/planet-editor.html",
                {
                    planet: planetToEdit,
                    types: CONFIG.SFRPG.planetTypes,
                    atmospheres: CONFIG.SFRPG.atmosTypes
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
    let planetToEdit = starmapPlanets.find((p) => p.planetId === planetId);

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
                planetToEdit.image = "modules/sfrpg-houserules-raavi/images/planets/Planet-" + CONFIG.SFRPG.planetImgPrefixes[planetType] + roll.total + ".png";
            } else if (planetType < 8) {
                let roll = new Roll("1d3");
                roll.evaluate();
                planetToEdit.image = "modules/sfrpg-houserules-raavi/images/planets/Planet-" + CONFIG.SFRPG.planetImgPrefixes[planetType] + roll.total + ".png";
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

        await updateNote("starmapPlanets", starmapPlanets);
        await updateNoteContents();
    }
}

async function updateNote(type, data) {
    let note = game.journal.entities.find((j) => j.data.name === "Starmap");
    let oldData = note.getFlag("sfrpg-houserules-raavi", type);
    if (oldData !== data) {
        await note.unsetFlag("sfrpg-houserules-raavi", type);
        await note.setFlag("sfrpg-houserules-raavi", type, data);
    }
}

async function getNoteContents(note, type, defaultData) {
    let data = note.getFlag("sfrpg-houserules-raavi", type);
    if (data === undefined || data === null) {
        await note.setFlag("sfrpg-houserules-raavi", type, defaultData);
        return defaultData;
    }
    return data;
}

async function updateNoteContents() {
    let note = game.journal.entities.find((j) => j.data.name === "Starmap");
    let template = "modules/sfrpg-houserules-raavi/templates/note-content.html";
    let systemsToShow = [];
    starmapSystems.forEach(sys => {
        if (sys.known > 0) {
            let planetsInSystem = starmapPlanets.filter((p) => p.systemId === sys.id);
            let resourcesInSystem = ["❌", "❌", "❌", "❌"];
            let specialsInSystem = 0;
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
                planets: planetsInSystem.length,
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
        return Math.ceil(calcDistanceLY(sys1, sys2) * jumpCost * modifier);
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
        knownSystems = starmapSystems;
    } else {
        knownSystems = starmapSystems.filter((s) => s.known > 0);
    }
    let destSystem = knownSystems.find((s) => s.id === sysId);

    if (destSystem === undefined || destSystem === null || sysId === currentSystem.id) {
        return;
    }

    let routePlotted = dijkstra(generateRouteTable(knownSystems), currentSystem.id, destSystem.id);
    let beyondMax = false;

    let sys1 = currentSystem;
    let creditCost = 0;
    let fuelCost = 0;
    routePlotted.path.forEach(node => {
        if (parseInt(node) === currentSystem.id) {
            return;
        }
        let sys2 = knownSystems.find((s) => s.id === parseInt(node));
        let dist = calcDistanceLY(sys1, sys2);
        if (sys1.owner !== 0 && sys2.owner !== 0 && (sys1.owner === sys2.owner || sys1.contestant === sys2.owner || sys1.owner === sys2.contestant)) {
            creditCost = creditCost + CONFIG.SFRPG.jumpGateCosts[sys2.owner];
            dist = 0;
        } else {
            if (routePlotted.distance !== "Infinity") {
                fuelCost = fuelCost + calcFuel(sys1, sys2, false, 1);
            } else {
                fuelCost = fuelCost + calcFuel(sys1, sys2, false, 2);
            }
        }
        if (dist > jumpRange) {
            beyondMax = true;
        }
        if (display) {
            let line = makeJumpLine([sys1.cx, sys1.cy, sys2.cx, sys2.cy], dist > jumpRange);
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
    starmapSystems.forEach(system => {
        if (system.cx > 0 && system.cy > 0) {
            let contestant = null;
            let owner = "#" + CONFIG.SFRPG.starmapColors[system.owner];
            if (system.contestant > 0) {
                contestant = CONFIG.SFRPG.starmapColors[system.contestant];
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
    starmapConnections.forEach(conn => {
        let connection = makeLine([conn.sys1cx, conn.sys1cy, conn.sys2cx, conn.sys2cy], conn.known);
        starMapCanvas.add(connection);
    });
}

async function renderSystemsPlayer() {
    starmapSystems.forEach(system => {
        if (system.cx > 0 && system.cy > 0 && system.known > 0) {
            let contestant = null;
            let owner = "#" + CONFIG.SFRPG.starmapColors[system.owner];
            if (system.contestant > 0) {
                contestant = CONFIG.SFRPG.starmapColors[system.contestant];
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
    starmapConnections.forEach(conn => {
        if (conn.known) {
            let connection = makeLine([conn.sys1cx, conn.sys1cy, conn.sys2cx, conn.sys2cy], conn.known);
            starMapCanvas.add(connection);
        }
    });
}

async function updateKnownConnections() {
    starmapConnections.forEach(conn => {
        let sys1 = starmapSystems.find((s) => s.id === conn.sys1);
        let sys2 = starmapSystems.find((s) => s.id === conn.sys2);
        conn.known = sys1.known > 0 && sys2.known > 0;
    });

    await updateNote("starmapConnections", starmapConnections);
}

function convertStarmapPlanets() {
    starmapPlanets.forEach((p) => {
        //add image
        if (p.type < 5) {
            let roll = new Roll("1d5");
            roll.evaluate();
            p.image = "modules/sfrpg-houserules-raavi/images/planets/Planet-" + CONFIG.SFRPG.planetImgPrefixes[p.type] + roll.total + ".png";
        } else if (p.type < 8) {
            let roll = new Roll("1d3");
            roll.evaluate();
            p.image = "modules/sfrpg-houserules-raavi/images/planets/Planet-" + CONFIG.SFRPG.planetImgPrefixes[p.type] + roll.total + ".png";
        } else {
            p.image = "modules/sfrpg-houserules-raavi/images/planets/Planet-Rainbow1.png"
        }

        if (p.specials !== undefined && p.specials !== null && p.specials !== "") {
            p.specials = p.specials.split(";");
        } else {
            p.specials = ["BRAK"];
        }
    });
}


function generateCanvasContents() {
    starMapCoords = createText(1070, 819);
    starMapCanvas.add(starMapCoords);
    starMapSysName = createText(1070, 799);
    starMapCanvas.add(starMapSysName);

    starMapFuelCost = createText(1070, 759);
    starMapFuelCost.text = '';
    starMapFuelCost.fill = '#FF0000';
    starMapCanvas.add(starMapFuelCost);
    starMapCreditCost = createText(1070, 779);
    starMapCreditCost.text = '';
    starMapCreditCost.fill = '#00FF00';
    starMapCanvas.add(starMapCreditCost);

    let shiplineX = makeLine([currentSystem.cx, 0, currentSystem.cx, 828], true);
    shiplineX.stroke = '#FF0000';
    shiplineX.strokeWidth = 1;
    starMapCanvas.add(shiplineX);
    let shiplineY = makeLine([0, currentSystem.cy, 1080, currentSystem.cy], true);
    shiplineY.stroke = '#FF0000';
    shiplineY.strokeWidth = 1;
    starMapCanvas.add(shiplineY);
}

// Fabric helpers
async function createStarMapCanvas() {
    starMapCanvas = new fabric.Canvas('mapcanvas');
    starMapCanvas.on('mouse:move', function (e) {
        updatestarMapCoords(e);
    });
    starMapCanvas.on('mouse:down', function (e) {
        selectSystem(e);
    });
    generateCanvasContents();

    await updateKnownConnections();

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

function makeLine(starMapCoords, known) {
    let colorFill = '#FF00FF';
    if (known) {
        colorFill = '#FFFF00';
    }
    return new fabric.Line(starMapCoords, {
        fill: colorFill,
        stroke: colorFill,
        strokeWidth: 3,
        selectable: false,
        evented: false,
        originX: 'center',
        originY: 'center'
    });
}

function makeJumpLine(starMapCoords, aboveMax) {
    let colorFill = '#00FF00';
    if (aboveMax) {
        colorFill = '#FF0000';
    }
    return new fabric.Line(starMapCoords, {
        fill: colorFill,
        stroke: colorFill,
        strokeWidth: 4,
        selectable: false,
        evented: false,
        originX: 'center',
        originY: 'center',
        jump: true
    });
}

function makeTargetLine(starMapCoords) {
    return new fabric.Line(starMapCoords, {
        fill: '#00FF00',
        stroke: '#00FF00',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        originX: 'center',
        originY: 'center'
    });
}

function makeCircle(x, y, owner, contestant, systemid, systemname) {
    let tmp = new fabric.Circle({
        radius: 15,
        fill: owner,
        strokeWidth: 1,
        stroke: '#FF0000',
        originX: 'center',
        originY: 'center',
        selectable: false,
        top: y,
        left: x,
        systemname: systemname,
        systemid: systemid,
        hoverCursor: 'pointer'
    });
    if (contestant != null) {
        tmp.setGradient('fill', {
            x1: 0,
            y1: 0,
            x2: tmp.width,
            y2: 0,
            colorStops: {
                0: owner,
                0.5: owner,
                0.51: contestant,
                1: contestant
            }
        });
    }
    return tmp;
}

function makePolygon(x, y, owner, contestant, systemid, systemname, sides) {
    let points = regularPolygonPoints(sides, 17);

    let tmp = new fabric.Polygon(points, {
        stroke: '#FF0000',
        fill: owner,
        left: x,
        top: y,
        strokeWidth: 1,
        strokeLineJoin: 'bevil',
        originX: 'center',
        originY: 'center',
        selectable: false,
        systemname: systemname,
        systemid: systemid,
        hoverCursor: 'pointer'
    }, false);

    if (contestant != null) {
        tmp.setGradient('fill', {
            x1: 0,
            y1: 0,
            x2: tmp.width,
            y2: 0,
            colorStops: {
                0: owner,
                0.5: owner,
                0.51: contestant,
                1: contestant
            }
        });
    }

    return tmp;
}

function regularPolygonPoints(sideCount, radius) {
    let sweep = Math.PI * 2 / sideCount;
    let cx = radius;
    let cy = radius;
    let points = [];
    for (let i = 0; i < sideCount; i++) {
        let x = cx + radius * Math.cos(i * sweep);
        let y = cy + radius * Math.sin(i * sweep);
        points.push({
            x: x,
            y: y
        });
    }
    return (points);
}

function createText(x, y) {
    return new fabric.Text('', {
        left: x,
        top: y,
        fontFamily: 'Lucida Console',
        textAlign: 'right',
        originX: 'right',
        originY: 'bottom',
        fontSize: 20,
        fill: '#FFFFFF',
        selectable: false
    });
}

function updatestarMapCoords(e) {
    if (e.target != null && e.target.systemname != null) {
        let x = e.target.getCenterPoint().x;
        let y = e.target.getCenterPoint().y;
        starMapCoords.text = x + ';' + y;
        if (game.user.isGM) {
            starMapSysName.text = e.target.systemname + ' [' + e.target.systemid + ']';
        } else {
            starMapSysName.text = e.target.systemname;
        }


        removeJumpLines();
        calcRouteToSystem(e.target.systemid, true);
        starMapCanvas.remove(selSysX);
        starMapCanvas.remove(selSysY);
        selSysX = makeTargetLine([x, 0, x, 828]);
        selSysY = makeTargetLine([0, y, 1080, y]);
        starMapCanvas.add(selSysX);
        starMapCanvas.add(selSysY);
        starMapCanvas.renderAll();
    } else {
        let x = e.e.layerX;
        let y = e.e.layerY;
        starMapCoords.text = x + ';' + y;
        starMapSysName.text = '';
        starMapFuelCost.text = '';
        starMapCreditCost.text = '';
    }
    starMapCanvas.renderAll();
}

async function selectSystem(e) {
    if (e.target != null && e.target.systemid != null) {
        await showSystem(e.target.systemid);
    }
}

function removeJumpLines() {
    let objects = starMapCanvas.getObjects('line');
    for (let i in objects) {
        if (objects[i].jump === true) {
            starMapCanvas.remove(objects[i]);
        }
    }
    starMapCanvas.renderAll();
}