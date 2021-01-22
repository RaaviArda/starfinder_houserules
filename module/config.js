import { SFRPG } from "../../../systems/sfrpg/module/config.js";
/**
 * The set of ability scores used with the system
 * @type {Object}
 */

/*--------------------------------*
 * Starship properties and values *
 *--------------------------------*/
SFRPG.starshipSizes = {
    "tiny": "SFRPG.ShipSystems.Size.SH", //Shuttle
    "small": "SFRPG.ShipSystems.Size.FR", //Frigate
    "medium": "SFRPG.ShipSystems.Size.DE", //Destroyer
    "large": "SFRPG.ShipSystems.Size.CR", //Cruiser
    "huge": "SFRPG.ShipSystems.Size.BC", //BC
    "gargantuan": "SFRPG.ShipSystems.Size.BS", //BS
    "colossal": "SFRPG.ShipSystems.Size.CAP", //Carrier
    "superColossal": "SFRPG.ShipSystems.Size.SCAP" //Supercarrier
};

SFRPG.powercoreMap = {
    "SH1"  : { size: ["tiny"],          pcu: 70 },
    "SH2"  : { size: ["tiny"],          pcu: 80 },
    "SH3"  : { size: ["tiny"],          pcu: 90 },
    "FR1"  : { size: ["small"],         pcu: 100 },
    "FR2"  : { size: ["small"],         pcu: 125 },
    "FR3"  : { size: ["small"],         pcu: 150 },
    "DE1"  : { size: ["medium"],        pcu: 150 },
    "DE2"  : { size: ["medium"],        pcu: 200 },
    "DE3"  : { size: ["medium"],        pcu: 250 },
    "CR1"  : { size: ["large"],         pcu: 250 },
    "CR2"  : { size: ["large"],         pcu: 300 },
    "CR3"  : { size: ["large"],         pcu: 350 },
    "ECR1" : { size: ["large"],         pcu: 300 },
    "ECR2" : { size: ["large"],         pcu: 350 },
    "ECR3" : { size: ["large"],         pcu: 400 },
    "BC1"  : { size: ["huge"],          pcu: 350 },
    "BC2"  : { size: ["huge"],          pcu: 450 },
    "BC3"  : { size: ["huge"],          pcu: 550 },
    "EBC1" : { size: ["huge"],          pcu: 400 },
    "EBC2" : { size: ["huge"],          pcu: 500 },
    "EBC3" : { size: ["huge"],          pcu: 600 },
    "BS1"  : { size: ["gargantuan"],    pcu: 550 },
    "BS2"  : { size: ["gargantuan"],    pcu: 650 },
    "BS3"  : { size: ["gargantuan"],    pcu: 750 },
    "CAP1" : { size: ["colossal"],      pcu: 800 },
    "CAP2" : { size: ["colossal"],      pcu: 1000 },
    "SCAP1": { size: ["superColossal"], pcu: 1000 },
    "SCAP2": { size: ["superColossal"], pcu: 1300 },
    // Double
    "2FR1"  : { size: ["small"],         pcu: 200 },
    "2FR2"  : { size: ["small"],         pcu: 250 },
    "2FR3"  : { size: ["small"],         pcu: 300 },
    "2DE1"  : { size: ["medium"],        pcu: 300 },
    "2DE2"  : { size: ["medium"],        pcu: 400 },
    "2DE3"  : { size: ["medium"],        pcu: 500 },
    "2CR1"  : { size: ["large"],         pcu: 500 },
    "2CR2"  : { size: ["large"],         pcu: 600 },
    "2CR3"  : { size: ["large"],         pcu: 700 },
    "2ECR1" : { size: ["large"],         pcu: 600 },
    "2ECR2" : { size: ["large"],         pcu: 700 },
    "2ECR3" : { size: ["large"],         pcu: 800 },
    "2BC1"  : { size: ["huge"],          pcu: 700 },
    "2BC2"  : { size: ["huge"],          pcu: 900 },
    "2BC3"  : { size: ["huge"],          pcu: 1100 },
    "2EBC1" : { size: ["huge"],          pcu: 800 },
    "2EBC2" : { size: ["huge"],          pcu: 1000 },
    "2EBC3" : { size: ["huge"],          pcu: 1200 },
    "2BS1"  : { size: ["gargantuan"],    pcu: 1100 },
    "2BS2"  : { size: ["gargantuan"],    pcu: 1300 },
    "2BS3"  : { size: ["gargantuan"],    pcu: 1500 },
    "2CAP1" : { size: ["colossal"],      pcu: 1600 },
    "2CAP2" : { size: ["colossal"],      pcu: 2000 },
    "2SCAP1": { size: ["superColossal"], pcu: 2000 },
    "2SCAP2": { size: ["superColossal"], pcu: 2600 }
};

SFRPG.thrustersMap = {
    "TSH1"  : { speed: 10, mod: 0, pcu: 20 },
    "TSH2"  : { speed: 12, mod: 0, pcu: 25 },
    "TSH3"  : { speed: 14, mod: 1, pcu: 30 },
    "TFR1"  : { speed: 12, mod: 0, pcu: 30 },
    "TFR2"  : { speed: 14, mod: 0, pcu: 35 },
    "TFR3"  : { speed: 16, mod: 1, pcu: 40 },
    "TDE1"  : { speed: 10, mod: 0, pcu: 40 },
    "TDE2"  : { speed: 12, mod: 0, pcu: 45 },
    "TDE3"  : { speed: 14, mod: 1, pcu: 50 },
    "TCR1"  : { speed: 8,  mod: 0, pcu: 50 },
    "TCR2"  : { speed: 9,  mod: 1, pcu: 60 },
    "TCR3"  : { speed: 10, mod: 2, pcu: 70 },
    "TBC1"  : { speed: 7,  mod: 0, pcu: 70 },
    "TBC2"  : { speed: 8,  mod: 1, pcu: 80 },
    "TBC3"  : { speed: 9,  mod: 1, pcu: 90 },
    "TBS1"  : { speed: 6,  mod: 0, pcu: 100 },
    "TBS2"  : { speed: 7,  mod: 1, pcu: 120 },
    "TBS3"  : { speed: 8,  mod: 2, pcu: 140 },
    "TCAP1" : { speed: 5,  mod: 0, pcu: 200 },
    "TCAP2" : { speed: 6,  mod: 0, pcu: 250 },
    "TSCAP1": { speed: 4,  mod: 0, pcu: 300 },
    "TSCAP2": { speed: 5,  mod: 0, pcu: 350 }
};

SFRPG.expansionBaySystems = {
    "Med"     : "SFRPG.ShipSystems.ExpansionBaySystems.Med", // 15
    "MedA"    : "SFRPG.ShipSystems.ExpansionBaySystems.MedA", // 20
    "Hosp"    : "SFRPG.ShipSystems.ExpansionBaySystems.Hosp", // 30
    "Cargo"   : "SFRPG.ShipSystems.ExpansionBaySystems.Cargo", // 0
    "Fuel"    : "SFRPG.ShipSystems.ExpansionBaySystems.Fuel", // 0
    "Science" : "SFRPG.ShipSystems.ExpansionBaySystems.Science", // 15
    "Tech"    : "SFRPG.ShipSystems.ExpansionBaySystems.Tech", // 15
    "GarageM" : "SFRPG.ShipSystems.ExpansionBaySystems.GarageM", // 5
    "GarageL" : "SFRPG.ShipSystems.ExpansionBaySystems.GarageL", // 10
    "HangarM" : "SFRPG.ShipSystems.ExpansionBaySystems.HangarM", // 30
    "HangarL" : "SFRPG.ShipSystems.ExpansionBaySystems.HangarL", // 50
    "Hydro1"  : "SFRPG.ShipSystems.ExpansionBaySystems.Hydro1", // 35
    "Hydro2"  : "SFRPG.ShipSystems.ExpansionBaySystems.Hydro2", // 50
    "Hydro3"  : "SFRPG.ShipSystems.ExpansionBaySystems.Hydro3", // 65
};

//    "Med"     : "Medical bay",
//    "MedA"    : "Advanced medical bay",
//    "Hosp"    : "Hospital bay",
//    "Cargo"   : "Cargo hold",
//    "Fuel"    : "Fuel tank",
//    "Science" : "Science lab",
//    "Tech"    : "Tech workshop",
//    "GarageM" : "Garage (M)",
//    "GarageL" : "Garage (L)",
//    "HangarM" : "Hangar bay (M)",
//    "HangarL" : "Hangar bay (L)",
//    "Hydro1"  : "Hydroponics I",
//    "Hydro2"  : "Hydroponics II",
//    "Hydro3"  : "Hydroponics III"

// SFRPG.shieldsPower = {
//     "10": 20,
//     "20": 40,
//     "30": 60,
//     "40": 80,
//     "50": 100,
//     "60": 120,
//     "70": 140,
//     "80": 160,
//     "90": 180,
//     "100": 200,
//     "120": 240,
//     "140": 280,
//     "160": 320,
//     "200": 400,
//     "240": 480,
//     "280": 560,
//     "320": 640,
//     "360": 720,
//     "420": 840,
//     "480": 960,
//     "540": 1080,
//     "600": 1200
// };