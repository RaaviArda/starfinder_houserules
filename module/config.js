/**
 * The set of ability scores used with the system
 * @type {Object}
 */

SFRPG.currencies = {
    "credit": "SFRPG.Credits",
    "upb": "SFRPG.MCredits"
};

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
    "SCAP2": "SFRPG.ShipSystems.PowerCoreSystems.SCAP2"
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
    "SCAP2": { size: ["superColossal"], pcu: 1300 }
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
    "TSH1"  : { speed: 10, mod: 0 },
    "TSH2"  : { speed: 12, mod: 0 },
    "TSH3"  : { speed: 14, mod: 1 },
    "TFR1"  : { speed: 12, mod: 0 },
    "TFR2"  : { speed: 14, mod: 0 },
    "TFR3"  : { speed: 16, mod: 1 },
    "TDE1"  : { speed: 10, mod: 0 },
    "TDE2"  : { speed: 12, mod: 0 },
    "TDE3"  : { speed: 14, mod: 1 },
    "TCR1"  : { speed: 8,  mod: 0 },
    "TCR2"  : { speed: 9,  mod: 1 },
    "TCR3"  : { speed: 10, mod: 2 },
    "TBC1"  : { speed: 7,  mod: 0 },
    "TBC2"  : { speed: 8,  mod: 1 },
    "TBC3"  : { speed: 9,  mod: 1 },
    "TBS1"  : { speed: 6,  mod: 0 },
    "TBS2"  : { speed: 7,  mod: 1 },
    "TBS3"  : { speed: 8,  mod: 2 },
    "TCAP1" : { speed: 5,  mod: 0 },
    "TCAP2" : { speed: 6,  mod: 0 },
    "TSCAP1": { speed: 4,  mod: 0 },
    "TSCAP2": { speed: 5,  mod: 0 }
};

SFRPG.expansionBaySystems = {
    "arclab"  : "SFRPG.ShipSystems.ExpansionBaySystems.Arclab",
    "cargo"   : "SFRPG.ShipSystems.ExpansionBaySystems.Cargo",
    "escape"  : "SFRPG.ShipSystems.ExpansionBaySystems.Escape",
    "guest"   : "SFRPG.ShipSystems.ExpansionBaySystems.Guest",
    "hangar"  : "SFRPG.ShipSystems.ExpansionBaySystems.Hangar",
    "life"    : "SFRPG.ShipSystems.ExpansionBaySystems.Life",
    "med"     : "SFRPG.ShipSystems.ExpansionBaySystems.Med",
    "pass"    : "SFRPG.ShipSystems.ExpansionBaySystems.Pass",
    "pwrHouse": "SFRPG.ShipSystems.ExpansionBaySystems.Pwrhouse",
    "recg"    : "SFRPG.ShipSystems.ExpansionBaySystems.Recg",
    "rect"    : "SFRPG.ShipSystems.ExpansionBaySystems.Rect",
    "hac"     : "SFRPG.ShipSystems.ExpansionBaySystems.Hac",
    "science" : "SFRPG.ShipSystems.ExpansionBaySystems.Science",
    "senv"    : "SFRPG.ShipSystems.ExpansionBaySystems.Senv",
    "shuttle" : "SFRPG.ShipSystems.ExpansionBaySystems.Shuttle",
    "smuggler": "SFRPG.ShipSystems.ExpansionBaySystems.Smuggler",
    "syth"    : "SFRPG.ShipSystems.ExpansionBaySystems.Syth",
    "tech"    : "SFRPG.ShipSystems.ExpansionBaySystems.Tech"
};

SFRPG.driftEngineMap = {
    "basic": 5,
    "booster": 6,
    "major": 6,
    "superior": 6,
    "ultra": 8
};