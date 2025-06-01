import {Reward} from './rewardCalculator';

interface RewardEntry {
    minLevel: number;
    reward: Reward;
    name?: string;  // 가디언 토벌 이름을 위한 옵셔널 필드 추가
}

// 카오스 던전 보상 표 (레벨 하한선 기준 내림차순)
export const chaosDungeonRewards: RewardEntry[] = [
    {
        minLevel: 1700,
        reward: {
            shards: {DESTINY_SHARD: 34000},
            leapStones: {DESTINY_LEAPSTONE: 23},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 280},
            armorStones: {DESTINY_GUARDIAN_STONE: 860},
            gems: {4: 4.8}
        }
    },
    {
        minLevel: 1680,
        reward: {
            shards: {DESTINY_SHARD: 31000},
            leapStones: {DESTINY_LEAPSTONE: 19},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 222},
            armorStones: {DESTINY_GUARDIAN_STONE: 670},
            gems: {4: 4.6}
        }
    },
    {
        minLevel: 1660,
        reward: {
            shards: {DESTINY_SHARD: 25800},
            leapStones: {DESTINY_LEAPSTONE: 15},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 163},
            armorStones: {DESTINY_GUARDIAN_STONE: 514},
            gems: {4: 4.0}
        }
    },
    {
        minLevel: 1640,
        reward: {
            shards: {DESTINY_SHARD: 21500},
            leapStones: {DESTINY_LEAPSTONE: 11},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 155},
            armorStones: {DESTINY_GUARDIAN_STONE: 483},
            gems: {4: 3.2}
        }
    },
    {
        minLevel: 1610,
        reward: {
            shards: {HONOR_SHARD: 23400},
            leapStones: {RADIANT_HONOR_LEAPSTONE: 10},
            weaponStones: {REFINED_OBLITERATION_STONE: 116},
            armorStones: {REFINED_PROTECTION_STONE: 334},
            gems: {3: 20.0}
        }
    },
    {
        minLevel: 1600,
        reward: {
            shards: {HONOR_SHARD: 22700},
            leapStones: {RADIANT_HONOR_LEAPSTONE: 8},
            weaponStones: {REFINED_OBLITERATION_STONE: 85},
            armorStones: {REFINED_PROTECTION_STONE: 260},
            gems: {3: 20.0}
        }
    },
    {
        minLevel: 1580,
        reward: {
            shards: {HONOR_SHARD: 20700},
            leapStones: {RADIANT_HONOR_LEAPSTONE: 6},
            weaponStones: {REFINED_OBLITERATION_STONE: 80},
            armorStones: {REFINED_PROTECTION_STONE: 240},
            gems: {3: 20.0}
        }
    },
    {
        minLevel: 1560,
        reward: {
            shards: {HONOR_SHARD: 20000},
            leapStones: {MARVELOUS_HONOR_LEAPSTONE: 12},
            weaponStones: {OBLITERATION_STONE: 190},
            armorStones: {PROTECTION_STONE: 560},
            gems: {3: 22.0}
        }
    },
    {
        minLevel: 1540,
        reward: {
            shards: {HONOR_SHARD: 16000},
            leapStones: {MARVELOUS_HONOR_LEAPSTONE: 10},
            weaponStones: {OBLITERATION_STONE: 150},
            armorStones: {PROTECTION_STONE: 480},
            gems: {3: 22.0}
        }
    },
    {
        minLevel: 1520,
        reward: {
            shards: {HONOR_SHARD: 13000},
            leapStones: {MARVELOUS_HONOR_LEAPSTONE: 9},
            weaponStones: {OBLITERATION_STONE: 130},
            armorStones: {PROTECTION_STONE: 400},
            gems: {3: 22.0}
        }
    },
    {
        minLevel: 1490,
        reward: {
            shards: {HONOR_SHARD: 11000},
            leapStones: {MARVELOUS_HONOR_LEAPSTONE: 6},
            weaponStones: {OBLITERATION_STONE: 100},
            armorStones: {PROTECTION_STONE: 300},
            gems: {3: 16.0}
        }
    },
    {
        minLevel: 1475,
        reward: {
            shards: {HONOR_SHARD: 6000},
            leapStones: {GREAT_HONOR_LEAPSTONE: 12},
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 200},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 600},
            gems: {3: 14.0}
        }
    },
    {
        minLevel: 1445,
        reward: {
            shards: {HONOR_SHARD: 5000},
            leapStones: {GREAT_HONOR_LEAPSTONE: 11},
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 180},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 570},
            gems: {3: 13.0}
        }
    },
    {
        minLevel: 1415,
        reward: {
            shards: {HONOR_SHARD: 4600},
            leapStones: {GREAT_HONOR_LEAPSTONE: 10},
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 160},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 480},
            gems: {3: 12.0}
        }
    },
    {
        minLevel: 1400,
        reward: {
            shards: {HONOR_SHARD: 4200},
            leapStones: {GREAT_HONOR_LEAPSTONE: 9},
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 140},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 420},
            gems: {3: 11.0}
        }
    },
    {
        minLevel: 1385,
        reward: {
            shards: {HONOR_SHARD: 4000},
            leapStones: {GREAT_HONOR_LEAPSTONE: 7},
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 125},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 390},
            gems: {3: 10.0}
        }
    },
    {
        minLevel: 1370,
        reward: {
            shards: {HONOR_SHARD: 3500},
            leapStones: {GREAT_HONOR_LEAPSTONE: 6},
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 110},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 360},
            gems: {3: 9.0}
        }
    },
];

// 가디언 토벌 보상 표
export const guardianRewards: RewardEntry[] = [
    {
        minLevel: 1700,
        name: "드렉탈라스",
        reward: {
            leapStones: {DESTINY_LEAPSTONE: 21},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 186},
            armorStones: {DESTINY_GUARDIAN_STONE: 550}
        }
    },
    {
        minLevel: 1680,
        name: "스콜라키아",
        reward: {
            leapStones: {DESTINY_LEAPSTONE: 17},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 196},
            armorStones: {DESTINY_GUARDIAN_STONE: 438}
        }
    },
    {
        minLevel: 1640,
        name: "아게오로스",
        reward: {
            leapStones: {DESTINY_LEAPSTONE: 12},
            weaponStones: {DESTINY_DESTRUCTION_STONE: 92},
            armorStones: {DESTINY_GUARDIAN_STONE: 281}
        }
    },
    {
        minLevel: 1630,
        name: "베스칼",
        reward: {
            leapStones: {RADIANT_HONOR_LEAPSTONE: 24},
            weaponStones: {REFINED_OBLITERATION_STONE: 165},
            armorStones: {REFINED_PROTECTION_STONE: 445}
        }
    },
    {
        minLevel: 1610,
        name: "가르가디스",
        reward: {
            leapStones: {RADIANT_HONOR_LEAPSTONE: 12},
            weaponStones: {REFINED_OBLITERATION_STONE: 103},
            armorStones: {REFINED_PROTECTION_STONE: 301}
        }
    },
    {
        minLevel: 1580,
        name: "소나벨",
        reward: {
            leapStones: {RADIANT_HONOR_LEAPSTONE: 8},
            weaponStones: {REFINED_OBLITERATION_STONE: 68},
            armorStones: {REFINED_PROTECTION_STONE: 204}
        }
    },
    {
        minLevel: 1540,
        name: "하누마탄",
        reward: {
            leapStones: {MARVELOUS_HONOR_LEAPSTONE: 14},
            weaponStones: {OBLITERATION_STONE: 101},
            armorStones: {PROTECTION_STONE: 306}
        }
    },
    {
        minLevel: 1490,
        name: "칼엘리고스",
        reward: {
            leapStones: {MARVELOUS_HONOR_LEAPSTONE: 10},
            weaponStones: {OBLITERATION_STONE: 75},
            armorStones: {PROTECTION_STONE: 226}
        }
    },
    {
        minLevel: 1460,
        name: "쿤겔라니움",
        reward: {
            leapStones: {GREAT_HONOR_LEAPSTONE: 16},
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 133},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 408}
        }
    },
    {
        minLevel: 1415,
        name: "데스칼루다",
        reward: {
            leapStones: {GREAT_HONOR_LEAPSTONE: 11},
            weaponStones: {DESTRUCTION_STONE_CRYSTAL: 101},
            armorStones: {GUARDIAN_STONE_CRYSTAL: 315}
        }
    },
];

// 레이드 보상 표는 구조가 복잡하므로 이후 단계에서 별도 파일로 분리/구현 예정 