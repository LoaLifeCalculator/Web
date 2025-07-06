export interface RaidReward {
    name: string;
    minLevel: number;
    raidName: string;
    goldReward: {
        gold: number;
        boundedGold: number;
        weaponStones: Record<string, number>;
        armorStones: Record<string, number>;
        shards: Record<string, number>;
        leapStones?: Record<string, number>;
        gems?: Record<string, number>;
    };
    nonGoldReward: {
        gold: number;
        boundedGold: number;
        leapStones: Record<string, number>;
        weaponStones: Record<string, number>;
        armorStones: Record<string, number>;
        shards: Record<string, number>;
        gems?: Record<string, number>;
    };
}

export const raidRewards: RaidReward[] = [
    {
        name: '모르둠 하드', minLevel: 1700, raidName: 'Mordum',
        goldReward: {
            gold: 38000,
            boundedGold: 0,
            leapStones: {DESTINY_LEAPSTONE: 20},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 1600},
            armorStones: {DESTINY_GUARDIAN_STONE: 3200},
            shards: {DESTINY_SHARD: 13000}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {DESTINY_LEAPSTONE: 151},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 5650},
            armorStones: {DESTINY_GUARDIAN_STONE: 11300},
            shards: {DESTINY_SHARD: 46700}
        }
    },
    {
        name: '아브렐슈드 하드', minLevel: 1690, raidName: 'BrelshazaKazeros',
        goldReward: {
            gold: 30500,
            boundedGold: 0,
            leapStones: {DESTINY_LEAPSTONE: 15},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 1340},
            armorStones: {DESTINY_GUARDIAN_STONE: 2680},
            shards: {DESTINY_SHARD: 10600}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {DESTINY_LEAPSTONE: 95},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 3590},
            armorStones: {DESTINY_GUARDIAN_STONE: 7380},
            shards: {DESTINY_SHARD: 32600}
        }
    },
    {
        name: '모르둠 노말', minLevel: 1680, raidName: 'Mordum',
        goldReward: {
            gold: 28000,
            boundedGold: 0,
            leapStones: {DESTINY_LEAPSTONE: 14},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 1240},
            armorStones: {DESTINY_GUARDIAN_STONE: 2480},
            shards: {DESTINY_SHARD: 9800}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {DESTINY_LEAPSTONE: 78},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 3200},
            armorStones: {DESTINY_GUARDIAN_STONE: 6400},
            shards: {DESTINY_SHARD: 27600}
        }
    },
    {
        name: '에기르 하드', minLevel: 1680, raidName: 'Aegir',
        goldReward: {
            gold: 24500,
            boundedGold: 0,
            leapStones: {DESTINY_LEAPSTONE: 13},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 1240},
            armorStones: {DESTINY_GUARDIAN_STONE: 2480},
            shards: {DESTINY_SHARD: 9600}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {DESTINY_LEAPSTONE: 72},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 3240},
            armorStones: {DESTINY_GUARDIAN_STONE: 6480},
            shards: {DESTINY_SHARD: 28100}
        }
    },
    {
        name: '아브렐슈드 노말', minLevel: 1670, raidName: 'BrelshazaKazeros',
        goldReward: {
            gold: 21500,
            boundedGold: 0,
            leapStones: {DESTINY_LEAPSTONE: 11},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 1180},
            armorStones: {DESTINY_GUARDIAN_STONE: 2360},
            shards: {DESTINY_SHARD: 8600}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {DESTINY_LEAPSTONE: 59},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 3030},
            armorStones: {DESTINY_GUARDIAN_STONE: 6060},
            shards: {DESTINY_SHARD: 26100}
        }
    },
    {
        name: '에기르 노말', minLevel: 1660, raidName: 'Aegir',
        goldReward: {
            gold: 15500,
            boundedGold: 0,
            leapStones: {DESTINY_LEAPSTONE: 9},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 1060},
            armorStones: {DESTINY_GUARDIAN_STONE: 2120},
            shards: {DESTINY_SHARD: 8000}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {DESTINY_LEAPSTONE: 38},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 2760},
            armorStones: {DESTINY_GUARDIAN_STONE: 5520},
            shards: {DESTINY_SHARD: 24000}
        }
    },
    {
        name: '베히모스', minLevel: 1640, raidName: 'Behemoth',
        goldReward: {
            gold: 8800,
            boundedGold: 0,
            leapStones: {DESTINY_LEAPSTONE: 5},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 480},
            armorStones: {DESTINY_GUARDIAN_STONE: 960},
            shards: {DESTINY_SHARD: 7000}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {DESTINY_LEAPSTONE: 24},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 1500},
            armorStones: {DESTINY_GUARDIAN_STONE: 3000},
            shards: {DESTINY_SHARD: 13730}
        }
    },
    {
        name: '에키드나 하드', minLevel: 1640, raidName: 'Echidna',
        goldReward: {
            gold: 8800,
            boundedGold: 0,
            leapStones: {DESTINY_LEAPSTONE: 5},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 460},
            armorStones: {DESTINY_GUARDIAN_STONE: 920},
            shards: {DESTINY_SHARD: 6500}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {DESTINY_LEAPSTONE: 24},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 1410},
            armorStones: {DESTINY_GUARDIAN_STONE: 2820},
            shards: {DESTINY_SHARD: 12960}
        }
    },
    {
        name: '카멘 하드', minLevel: 1630, raidName: 'Thaemine',
        goldReward: {
            gold: 6500,
            boundedGold: 6500,
            leapStones: {RADIANT_HONOR_LEAPSTONE: 27},
            weaponStones: {REFINED_OBLITERATION_STONE: 1140},
            armorStones: {REFINED_PROTECTION_STONE: 2280},
            shards: {HONOR_SHARD: 18300}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {RADIANT_HONOR_LEAPSTONE: 86},
            weaponStones: {REFINED_OBLITERATION_STONE: 2710},
            armorStones: {REFINED_PROTECTION_STONE: 5420},
            shards: {HONOR_SHARD: 34070}
        }
    },
    {
        name: '에키드나 노말', minLevel: 1620, raidName: 'Echidna',
        goldReward: {
            gold: 3650,
            boundedGold: 3650,
            leapStones: {RADIANT_HONOR_LEAPSTONE: 11},
            weaponStones: {REFINED_OBLITERATION_STONE: 570},
            armorStones: {REFINED_PROTECTION_STONE: 1140},
            shards: {HONOR_SHARD: 11700}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {RADIANT_HONOR_LEAPSTONE: 43},
            weaponStones: {REFINED_OBLITERATION_STONE: 1420},
            armorStones: {REFINED_PROTECTION_STONE: 2840},
            shards: {HONOR_SHARD: 22390}
        }
    },
    {
        name: '상아탑 하드', minLevel: 1620, raidName: 'IvoryTower',
        goldReward: {
            gold: 3600,
            boundedGold: 3600,
            leapStones: {RADIANT_HONOR_LEAPSTONE: 13},
            weaponStones: {REFINED_OBLITERATION_STONE: 800},
            armorStones: {REFINED_PROTECTION_STONE: 1600},
            shards: {HONOR_SHARD: 11900}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {RADIANT_HONOR_LEAPSTONE: 45},
            weaponStones: {REFINED_OBLITERATION_STONE: 1430},
            armorStones: {REFINED_PROTECTION_STONE: 2860},
            shards: {HONOR_SHARD: 27700}
        }
    },
    {
        name: '카멘 노말', minLevel: 1610, raidName: 'Thaemine',
        goldReward: {
            gold: 3200,
            boundedGold: 3200,
            leapStones: {RADIANT_HONOR_LEAPSTONE: 16},
            weaponStones: {REFINED_OBLITERATION_STONE: 555},
            armorStones: {REFINED_PROTECTION_STONE: 1110},
            shards: {HONOR_SHARD: 11250}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {RADIANT_HONOR_LEAPSTONE: 50},
            weaponStones: {REFINED_OBLITERATION_STONE: 1485},
            armorStones: {REFINED_PROTECTION_STONE: 2970},
            shards: {HONOR_SHARD: 20130}
        }
    },
    {
        name: '상아탑 노말', minLevel: 1600, raidName: 'IvoryTower',
        goldReward: {
            gold: 2600,
            boundedGold: 2600,
            leapStones: {RADIANT_HONOR_LEAPSTONE: 10},
            weaponStones: {REFINED_OBLITERATION_STONE: 660},
            armorStones: {REFINED_PROTECTION_STONE: 1320},
            shards: {HONOR_SHARD: 10500}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {RADIANT_HONOR_LEAPSTONE: 37},
            weaponStones: {REFINED_OBLITERATION_STONE: 1200},
            armorStones: {REFINED_PROTECTION_STONE: 2400},
            shards: {HONOR_SHARD: 23700}
        }
    },
    {
        name: '일리아칸 하드', minLevel: 1600, raidName: 'Illiakan',
        goldReward: {
            gold: 3000,
            boundedGold: 3000,
            leapStones: {RADIANT_HONOR_LEAPSTONE: 10},
            weaponStones: {REFINED_OBLITERATION_STONE: 700},
            armorStones: {REFINED_PROTECTION_STONE: 1400},
            shards: {HONOR_SHARD: 10800}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {RADIANT_HONOR_LEAPSTONE: 43},
            weaponStones: {REFINED_OBLITERATION_STONE: 1350},
            armorStones: {REFINED_PROTECTION_STONE: 2700},
            shards: {HONOR_SHARD: 21600}
        }
    },
    {
        name: '일리아칸 노말', minLevel: 1580, raidName: 'Illiakan',
        goldReward: {
            gold: 2350,
            boundedGold: 2350,
            leapStones: {RADIANT_HONOR_LEAPSTONE: 7},
            weaponStones: {REFINED_OBLITERATION_STONE: 580},
            armorStones: {REFINED_PROTECTION_STONE: 1160},
            shards: {HONOR_SHARD: 9600}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {RADIANT_HONOR_LEAPSTONE: 33},
            weaponStones: {REFINED_OBLITERATION_STONE: 1110},
            armorStones: {REFINED_PROTECTION_STONE: 2220},
            shards: {HONOR_SHARD: 21740}
        }
    },
    {
        name: '카양겔 하드', minLevel: 1580, raidName: 'Kayangel',
        goldReward: {
            gold: 2150,
            boundedGold: 2150,
            leapStones: {RADIANT_HONOR_LEAPSTONE: 7},
            weaponStones: {REFINED_OBLITERATION_STONE: 350},
            armorStones: {REFINED_PROTECTION_STONE: 700},
            shards: {HONOR_SHARD: 11000}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {RADIANT_HONOR_LEAPSTONE: 20},
            weaponStones: {REFINED_OBLITERATION_STONE: 610},
            armorStones: {REFINED_PROTECTION_STONE: 1220},
            shards: {HONOR_SHARD: 22900}
        }
    },
    {
        name: '카양겔 노말', minLevel: 1540, raidName: 'Kayangel',
        goldReward: {
            gold: 1650,
            boundedGold: 1650,
            leapStones: {MARVELOUS_HONOR_LEAPSTONE: 10},
            weaponStones: {OBLITERATION_STONE: 960},
            armorStones: {PROTECTION_STONE: 1920},
            shards: {HONOR_SHARD: 8700}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {MARVELOUS_HONOR_LEAPSTONE: 46},
            weaponStones: {OBLITERATION_STONE: 1740},
            armorStones: {PROTECTION_STONE: 3480},
            shards: {HONOR_SHARD: 20290}
        }
    },
    {
        name: '아브렐슈드(3T) 하드', minLevel: 1540, raidName: 'BrelshazaLegion',
        goldReward: {
            gold: 2800,
            boundedGold: 2800,
            leapStones: {MARVELOUS_HONOR_LEAPSTONE: 14},
            weaponStones: {OBLITERATION_STONE: 1800},
            armorStones: {PROTECTION_STONE: 3600},
            shards: {HONOR_SHARD: 14000}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {MARVELOUS_HONOR_LEAPSTONE: 106},
            weaponStones: {OBLITERATION_STONE: 4120},
            armorStones: {PROTECTION_STONE: 8240},
            shards: {HONOR_SHARD: 36200}
        }
    },
    {
        name: '아브렐슈드(3T) 노말', minLevel: 1490, raidName: 'BrelshazaLegion',
        goldReward: {
            gold: 2300,
            boundedGold: 2300,
            leapStones: {MARVELOUS_HONOR_LEAPSTONE: 10},
            weaponStones: {OBLITERATION_STONE: 800},
            armorStones: {PROTECTION_STONE: 1600},
            shards: {HONOR_SHARD: 7000}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {MARVELOUS_HONOR_LEAPSTONE: 72},
            weaponStones: {OBLITERATION_STONE: 2000},
            armorStones: {PROTECTION_STONE: 4000},
            shards: {HONOR_SHARD: 24000}
        }
    },
    {
        name: '쿠크세이튼', minLevel: 1475, raidName: 'Kukuseiton',
        goldReward: {
            gold: 1500,
            boundedGold: 1500,
            leapStones: {GREAT_HONOR_LEAPSTONE: 15},
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 760},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 1520},
            shards: {HONOR_SHARD: 3000}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {GREAT_HONOR_LEAPSTONE: 57},
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 2200},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 4400},
            shards: {HONOR_SHARD: 10000}
        }
    },
    {
        name: '비아키스 하드', minLevel: 1460, raidName: 'Viakiss',
        goldReward: {
            gold: 1200,
            boundedGold: 1200,
            leapStones: {GREAT_HONOR_LEAPSTONE: 14},
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 620},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 1240},
            shards: {HONOR_SHARD: 2000}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {GREAT_HONOR_LEAPSTONE: 38},
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 1590},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 3180},
            shards: {HONOR_SHARD: 5600}
        }
    },
    {
        name: '발탄 하드', minLevel: 1445, raidName: 'Valtan',
        goldReward: {
            gold: 900,
            boundedGold: 900,
            leapStones: {GREAT_HONOR_LEAPSTONE: 12},
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 530},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 1060},
            shards: {HONOR_SHARD: 1850}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {GREAT_HONOR_LEAPSTONE: 32},
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 1370},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 2740},
            shards: {HONOR_SHARD: 4750}
        }
    },
    {
        name: '비아키스 노말', minLevel: 1430, raidName: 'Viakiss',
        goldReward: {
            gold: 800,
            boundedGold: 800,
            leapStones: {GREAT_HONOR_LEAPSTONE: 12},
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 520},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 1040},
            shards: {HONOR_SHARD: 1800}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {GREAT_HONOR_LEAPSTONE: 31},
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 1280},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 2560},
            shards: {HONOR_SHARD: 3800}
        }
    },
    {
        name: '발탄 노말', minLevel: 1415, raidName: 'Valtan',
        goldReward: {
            gold: 600,
            boundedGold: 600,
            leapStones: {GREAT_HONOR_LEAPSTONE: 10},
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 440},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 880},
            shards: {HONOR_SHARD: 1500}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {GREAT_HONOR_LEAPSTONE: 25},
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 1080},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 2160},
            shards: {HONOR_SHARD: 3000}
        }
    },
    {
        name: '아르고스', minLevel: 1370, raidName: 'Argos',
        goldReward: {
            gold: 500,
            boundedGold: 500,
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 350},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 700},
            shards: {HONOR_SHARD: 1000}
        },
        nonGoldReward: {
            gold: 0,
            boundedGold: 0,
            leapStones: {GREAT_HONOR_LEAPSTONE: 15},
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 620},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 1240},
            shards: {HONOR_SHARD: 2920}
        }
    }
];
