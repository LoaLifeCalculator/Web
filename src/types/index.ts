export interface CharacterResponseDto {
  characterName: string;
  className: string;
  level: number;
  serverName: string;
}

export interface Resource {
  name: string;
  price: number;
  type: 'TRADEABLE' | 'BOUND';
}

export interface ContentReward {
  name: string;
  gold: number;
  resources: Resource[];
  requiredLevel: number;
}

export interface Raid extends ContentReward {
  difficulty: string;
  type: string;
}

export interface ChaosDungeon extends ContentReward {
  tier: number;
}

export interface Guardian extends ContentReward {
  tier: number;
}

export interface SearchResponseDto {
  characters: CharacterResponseDto[];
  totalGold: number;
  boundGold: number;
}

export interface CharacterState {
  isGoldEnabled: boolean;
  isExcluded: boolean;
  selectedRaids: string[];
}

export interface ItemTranslation {
  [key: string]: string;
}

export interface Reward {
  gold?: number;
  weaponStones?: Record<string, number>;
  armorStones?: Record<string, number>;
  shards?: Record<string, number>;
  gems?: Record<string, number>;
  leapStones?: Record<string, number>;
}

export const ITEM_TRANSLATIONS: ItemTranslation = {
  DESTINY_DESTRUCTION_STONE: "운명의 파괴석",
  REFINED_OBLITERATION_STONE: "정제된 파괴강석",
  OBLITERATION_STONE: "파괴강석",
  DESTRUCTION_STONE_CRYSTAL: "파괴석 결정",
  DESTINY_GUARDIAN_STONE: "운명의 수호석",
  REFINED_PROTECTION_STONE: "정제된 수호강석",
  PROTECTION_STONE: "수호강석",
  GUARDIAN_STONE_CRYSTAL: "수호석 결정",
  DESTINY_SHARD: "운명의 파편",
  HONOR_SHARD: "명예의 파편",
  DESTINY_LEAPSTONE: "운명의 돌파석",
  RADIANT_HONOR_LEAPSTONE: "찬란한 명예의 돌파석",
  MARVELOUS_HONOR_LEAPSTONE: "경이로운 명예의 돌파석",
  GREAT_HONOR_LEAPSTONE: "위대한 명예의 돌파석",
  GEM_TIER_3: "3티어 1레벨 보석",
  GEM_TIER_4: "4티어 1레벨 보석"
}; 