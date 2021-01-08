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

SFRPG.powerCoreSystems = {
    "SH1"  : "SFRPG.ShipSystems.PowerCoreSystems.SH1",
    "SH2"  : "SFRPG.ShipSystems.PowerCoreSystems.SH2",
    "SH3"  : "SFRPG.ShipSystems.PowerCoreSystems.SH3",
    "FR1"  : "SFRPG.ShipSystems.PowerCoreSystems.FR1",
    "FR2"  : "SFRPG.ShipSystems.PowerCoreSystems.FR2",
    "FR3"  : "SFRPG.ShipSystems.PowerCoreSystems.FR3",
    "DE1"  : "SFRPG.ShipSystems.PowerCoreSystems.DE1",
    "DE2"  : "SFRPG.ShipSystems.PowerCoreSystems.DE2",
    "DE3"  : "SFRPG.ShipSystems.PowerCoreSystems.DE3",
    "CR1"  : "SFRPG.ShipSystems.PowerCoreSystems.CR1",
    "CR2"  : "SFRPG.ShipSystems.PowerCoreSystems.CR2",
    "CR3"  : "SFRPG.ShipSystems.PowerCoreSystems.CR3",
    "ECR1" : "SFRPG.ShipSystems.PowerCoreSystems.ECR1",
    "ECR2" : "SFRPG.ShipSystems.PowerCoreSystems.ECR2",
    "ECR3" : "SFRPG.ShipSystems.PowerCoreSystems.ECR3",
    "BC1"  : "SFRPG.ShipSystems.PowerCoreSystems.BC1",
    "BC2"  : "SFRPG.ShipSystems.PowerCoreSystems.BC2",
    "BC3"  : "SFRPG.ShipSystems.PowerCoreSystems.BC3",
    "EBC1" : "SFRPG.ShipSystems.PowerCoreSystems.EBC1",
    "EBC2" : "SFRPG.ShipSystems.PowerCoreSystems.EBC2",
    "EBC3" : "SFRPG.ShipSystems.PowerCoreSystems.EBC3",
    "BS1"  : "SFRPG.ShipSystems.PowerCoreSystems.BS1",
    "BS2"  : "SFRPG.ShipSystems.PowerCoreSystems.BS2",
    "BS3"  : "SFRPG.ShipSystems.PowerCoreSystems.BS3",
    "CAP1" : "SFRPG.ShipSystems.PowerCoreSystems.CAP1",
    "CAP2" : "SFRPG.ShipSystems.PowerCoreSystems.CAP2",
    "SCAP1": "SFRPG.ShipSystems.PowerCoreSystems.SCAP1",
    "SCAP2": "SFRPG.ShipSystems.PowerCoreSystems.SCAP2",
    // Double
    "2FR1"  : "SFRPG.ShipSystems.PowerCoreSystems.2FR1",
    "2FR2"  : "SFRPG.ShipSystems.PowerCoreSystems.2FR2",
    "2FR3"  : "SFRPG.ShipSystems.PowerCoreSystems.2FR3",
    "2DE1"  : "SFRPG.ShipSystems.PowerCoreSystems.2DE1",
    "2DE2"  : "SFRPG.ShipSystems.PowerCoreSystems.2DE2",
    "2DE3"  : "SFRPG.ShipSystems.PowerCoreSystems.2DE3",
    "2CR1"  : "SFRPG.ShipSystems.PowerCoreSystems.2CR1",
    "2CR2"  : "SFRPG.ShipSystems.PowerCoreSystems.2CR2",
    "2CR3"  : "SFRPG.ShipSystems.PowerCoreSystems.2CR3",
    "2ECR1" : "SFRPG.ShipSystems.PowerCoreSystems.2ECR1",
    "2ECR2" : "SFRPG.ShipSystems.PowerCoreSystems.2ECR2",
    "2ECR3" : "SFRPG.ShipSystems.PowerCoreSystems.2ECR3",
    "2BC1"  : "SFRPG.ShipSystems.PowerCoreSystems.2BC1",
    "2BC2"  : "SFRPG.ShipSystems.PowerCoreSystems.2BC2",
    "2BC3"  : "SFRPG.ShipSystems.PowerCoreSystems.2BC3",
    "2EBC1" : "SFRPG.ShipSystems.PowerCoreSystems.2EBC1",
    "2EBC2" : "SFRPG.ShipSystems.PowerCoreSystems.2EBC2",
    "2EBC3" : "SFRPG.ShipSystems.PowerCoreSystems.2EBC3",
    "2BS1"  : "SFRPG.ShipSystems.PowerCoreSystems.2BS1",
    "2BS2"  : "SFRPG.ShipSystems.PowerCoreSystems.2BS2",
    "2BS3"  : "SFRPG.ShipSystems.PowerCoreSystems.2BS3",
    "2CAP1" : "SFRPG.ShipSystems.PowerCoreSystems.2CAP1",
    "2CAP2" : "SFRPG.ShipSystems.PowerCoreSystems.2CAP2",
    "2SCAP1": "SFRPG.ShipSystems.PowerCoreSystems.2SCAP1",
    "2SCAP2": "SFRPG.ShipSystems.PowerCoreSystems.2SCAP2"
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

SFRPG.thrusterSystems = {
    "TSH1"  : "SFRPG.ShipSystems.ThrusterSystems.TSH1",
    "TSH2"  : "SFRPG.ShipSystems.ThrusterSystems.TSH2",
    "TSH3"  : "SFRPG.ShipSystems.ThrusterSystems.TSH3",
    "TFR1"  : "SFRPG.ShipSystems.ThrusterSystems.TFR1",
    "TFR2"  : "SFRPG.ShipSystems.ThrusterSystems.TFR2",
    "TFR3"  : "SFRPG.ShipSystems.ThrusterSystems.TFR3",
    "TDE1"  : "SFRPG.ShipSystems.ThrusterSystems.TDE1",
    "TDE2"  : "SFRPG.ShipSystems.ThrusterSystems.TDE2",
    "TDE3"  : "SFRPG.ShipSystems.ThrusterSystems.TDE3",
    "TCR1"  : "SFRPG.ShipSystems.ThrusterSystems.TCR1",
    "TCR2"  : "SFRPG.ShipSystems.ThrusterSystems.TCR2",
    "TCR3"  : "SFRPG.ShipSystems.ThrusterSystems.TCR3",
    "TBC1"  : "SFRPG.ShipSystems.ThrusterSystems.TBC1",
    "TBC2"  : "SFRPG.ShipSystems.ThrusterSystems.TBC2",
    "TBC3"  : "SFRPG.ShipSystems.ThrusterSystems.TBC3",
    "TBS1"  : "SFRPG.ShipSystems.ThrusterSystems.TBS1",
    "TBS2"  : "SFRPG.ShipSystems.ThrusterSystems.TBS2",
    "TBS3"  : "SFRPG.ShipSystems.ThrusterSystems.TBS3",
    "TCAP1" : "SFRPG.ShipSystems.ThrusterSystems.TCAP1",
    "TCAP2" : "SFRPG.ShipSystems.ThrusterSystems.TCAP2",
    "TSCAP1": "SFRPG.ShipSystems.ThrusterSystems.TSCAP1",
    "TSCAP2": "SFRPG.ShipSystems.ThrusterSystems.TSCAP2"
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
    "Med"     : "SFRPG.ShipSystems.ExpansionBaySystems.Med",
    "MedA"    : "SFRPG.ShipSystems.ExpansionBaySystems.MedA",
    "Hosp"    : "SFRPG.ShipSystems.ExpansionBaySystems.Hosp",
    "Cargo"   : "SFRPG.ShipSystems.ExpansionBaySystems.Cargo",
    "Fuel"    : "SFRPG.ShipSystems.ExpansionBaySystems.Fuel",
    "Science" : "SFRPG.ShipSystems.ExpansionBaySystems.Science",
    "Tech"    : "SFRPG.ShipSystems.ExpansionBaySystems.Tech",
    "GarageM" : "SFRPG.ShipSystems.ExpansionBaySystems.GarageM",
    "GarageL" : "SFRPG.ShipSystems.ExpansionBaySystems.GarageL",
    "HangarM" : "SFRPG.ShipSystems.ExpansionBaySystems.HangarM",
    "HangarL" : "SFRPG.ShipSystems.ExpansionBaySystems.HangarL",
    "Hydro1"  : "SFRPG.ShipSystems.ExpansionBaySystems.Hydro1",
    "Hydro2"  : "SFRPG.ShipSystems.ExpansionBaySystems.Hydro2",
    "Hydro3"  : "SFRPG.ShipSystems.ExpansionBaySystems.Hydro3",
};

SFRPG.driftEngineMap = {
    "basic": 6,
    "booster": 7,
    "major": 7,
    "superior": 7,
    "ultra": 9
};

SFRPG.shieldsPower = {
    "10": 20,
    "20": 40,
    "30": 60,
    "40": 80,
    "50": 100,
    "60": 120,
    "70": 140,
    "80": 160,
    "90": 180,
    "100": 200,
    "120": 240,
    "140": 280,
    "160": 320,
    "200": 400,
    "240": 480,
    "280": 560,
    "320": 640,
    "360": 720,
    "420": 840,
    "480": 960,
    "540": 1080,
    "600": 1200
};