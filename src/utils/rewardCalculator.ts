import { chaosDungeonRewards, guardianRewards } from './rewardTables';
import { raidRewards } from './raidTable';

export interface Reward {
  shards?: Record<string, number>;
  leapStones?: Record<string, number>;
  weaponStones?: Record<string, number>;
  armorStones?: Record<string, number>;
  gems?: Record<string, number>;
  gold?: number;
}

// 시세 정보 예시: { DESTINY_SHARD: 0.2, ... }
export function getSuitableChaosReward(level: number): Reward | null {
  const reward = chaosDungeonRewards.find(r => level >= r.minLevel)?.reward;
  return reward || null;
}

export function getSuitableGuardianReward(level: number): Reward | null {
  const reward = guardianRewards.find(r => level >= r.minLevel)?.reward;
  return reward || null;
}

// 레벨에 맞는 입장 가능 레이드 리스트 반환 (중복 없는 이름, 높은 레벨 우선)
export function getAvailableRaids(level: number, limit = 6) {
  const filtered = raidRewards.filter(r => level >= r.minLevel);
  const unique: Record<string, any> = {};
  // 레벨 기준 내림차순 정렬
  for (const raid of filtered.sort((a, b) => b.minLevel - a.minLevel)) {
    if (!unique[raid.name]) unique[raid.name] = raid;
  }
  return Object.values(unique).slice(0, limit);
}

// 레이드 보상 계산 (골드/비골드)
export function calcRaidReward(raid: any, priceMap: Record<string, number>, goldReceived: boolean) {
  const reward = goldReceived ? raid.goldReward : raid.nonGoldReward;
  return calcRewardGold(reward, priceMap);
}

// 거래 가능 골드 계산 (RewardCalculator.kt의 calculateTradableGold 참고)
export const calcTradableGold = (reward: Reward | null, priceMap: Record<string, number>, isRest: boolean = false): number => {
  if (!reward) return 0;
  
  let total = 0;
  const multiplier = isRest ? 2/3 : 1;

  // 파편
  if (reward.shards) {
    Object.entries(reward.shards).forEach(([item, amount]) => {
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  // 도약석
  if (reward.leapStones) {
    Object.entries(reward.leapStones).forEach(([item, amount]) => {
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  // 무기 강화석
  if (reward.weaponStones) {
    Object.entries(reward.weaponStones).forEach(([item, amount]) => {
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  // 방어구 강화석
  if (reward.armorStones) {
    Object.entries(reward.armorStones).forEach(([item, amount]) => {
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  // 보석
  if (reward.gems) {
    Object.entries(reward.gems).forEach(([item, amount]) => {
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  return total * multiplier;
};

// 귀속 골드 계산 (RewardCalculator.kt의 calculateBoundGold 참고)
export const calcBoundGold = (reward: Reward | null, priceMap: Record<string, number>, isRest: boolean = false): number => {
  if (!reward) return 0;
  
  let total = 0;
  const multiplier = isRest ? 2/3 : 1;

  // 골드 보상
  if (reward.gold) {
    total += reward.gold;
  }

  return total * multiplier;
};

// 보상 표와 시세를 곱해 합산 (골드 환산)
export function calcRewardGold(reward: Reward, priceMap: Record<string, number>, isRest: boolean = false): number {
  return calcTradableGold(reward, priceMap, isRest) + calcBoundGold(reward, priceMap, isRest);
} 