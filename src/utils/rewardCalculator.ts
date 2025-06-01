import { chaosDungeonRewards, guardianRewards } from './rewardTables';
import { raidRewards, RaidReward } from './raidTable';

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
export function getAvailableRaids(level: number): RaidReward[] {
  const availableRaids = raidRewards.filter(raid => raid.minLevel <= level);
  
  // 레벨별로 정렬
  const sortedRaids = availableRaids.sort((a, b) => b.minLevel - a.minLevel);
  
  // raidName을 기준으로 중복 제거 (가장 높은 레벨의 레이드만 선택)
  const uniqueRaids = sortedRaids.reduce((acc: RaidReward[], current) => {
    const existingRaid = acc.find(raid => raid.raidName === current.raidName);
    if (!existingRaid) {
      acc.push(current);
    }
    return acc;
  }, []);
  
  // 상위 6개 레이드만 반환
  return uniqueRaids.slice(0, 6);
}

// 레이드 보상 계산 (골드/비골드)
export function calcRaidReward(raid: any, priceMap: Record<string, number>, goldReceived: boolean) {
  const reward = goldReceived ? raid.goldReward : raid.nonGoldReward;
  return calcRewardGold(reward, priceMap);
}

// 카오스 던전 거래 가능 골드 계산
export const calcChaosTradableGold = (reward: Reward | null, priceMap: Record<string, number>, isRest: boolean = false): number => {
  if (!reward) return 0;
  
  let total = 0;
  const multiplier = isRest ? 14/3 : 7;

  // 골드 보상 (항상 거래 가능)
  if (reward.gold) {
    total += reward.gold;
  }

  // 무기 강화석 (카오스 던전에서는 거래 가능)
  if (reward.weaponStones) {
    Object.entries(reward.weaponStones).forEach(([item, amount]) => {
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  // 방어구 강화석 (카오스 던전에서는 거래 가능)
  if (reward.armorStones) {
    Object.entries(reward.armorStones).forEach(([item, amount]) => {
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  // 보석 (항상 거래 가능)
  if (reward.gems) {
    Object.entries(reward.gems).forEach(([grade, amount]) => {
      const item = `GEM_TIER_${grade}`;
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  return total * multiplier;
};

// 카오스 던전 귀속 골드 계산
export const calcChaosBoundGold = (reward: Reward | null, priceMap: Record<string, number>, isRest: boolean = false): number => {
  if (!reward) return 0;
  
  let total = 0;
  const multiplier = isRest ? 14/3 : 7;

  // 파편 (항상 귀속)
  if (reward.shards) {
    Object.entries(reward.shards).forEach(([item, amount]) => {
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  // 도약석 (카오스 던전에서는 귀속)
  if (reward.leapStones) {
    Object.entries(reward.leapStones).forEach(([item, amount]) => {
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  return total * multiplier;
};

// 가디언 토벌 거래 가능 골드 계산
export const calcGuardianTradableGold = (reward: Reward | null, priceMap: Record<string, number>, isRest: boolean = false): number => {
  if (!reward) return 0;
  
  let total = 0;
  const multiplier = isRest ? 14/3 : 7;

  // 골드 보상 (항상 거래 가능)
  if (reward.gold) {
    total += reward.gold;
  }

  // 무기 강화석 (가디언 토벌에서는 거래 가능)
  if (reward.weaponStones) {
    Object.entries(reward.weaponStones).forEach(([item, amount]) => {
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  // 방어구 강화석 (가디언 토벌에서는 거래 가능)
  if (reward.armorStones) {
    Object.entries(reward.armorStones).forEach(([item, amount]) => {
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  // 도약석 (가디언 토벌에서는 거래 가능)
  if (reward.leapStones) {
    Object.entries(reward.leapStones).forEach(([item, amount]) => {
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  // 보석 (항상 거래 가능)
  if (reward.gems) {
    Object.entries(reward.gems).forEach(([grade, amount]) => {
      const item = `GEM_TIER_${grade}`;
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  return total * multiplier;
};

// 가디언 토벌 귀속 골드 계산
export const calcGuardianBoundGold = (reward: Reward | null, priceMap: Record<string, number>, isRest: boolean = false): number => {
  if (!reward) return 0;
  
  let total = 0;
  const multiplier = isRest ? 14/3 : 7;

  // 파편 (항상 귀속)
  if (reward.shards) {
    Object.entries(reward.shards).forEach(([item, amount]) => {
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  return total * multiplier;
};

// 레이드 거래 가능 골드 계산
export const calcRaidTradableGold = (reward: Reward | null, priceMap: Record<string, number>): number => {
  if (!reward) return 0;
  
  let total = 0;

  // 골드 보상 (항상 거래 가능)
  if (reward.gold) {
    total += reward.gold;
  }

  // 보석 (항상 거래 가능)
  if (reward.gems) {
    Object.entries(reward.gems).forEach(([grade, amount]) => {
      const item = `GEM_TIER_${grade}`;
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  return total;
};

// 레이드 귀속 골드 계산
export const calcRaidBoundGold = (reward: Reward | null, priceMap: Record<string, number>): number => {
  if (!reward) return 0;
  
  let total = 0;

  // 파편 (항상 귀속)
  if (reward.shards) {
    Object.entries(reward.shards).forEach(([item, amount]) => {
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  // 무기 강화석 (레이드에서는 귀속)
  if (reward.weaponStones) {
    Object.entries(reward.weaponStones).forEach(([item, amount]) => {
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  // 방어구 강화석 (레이드에서는 귀속)
  if (reward.armorStones) {
    Object.entries(reward.armorStones).forEach(([item, amount]) => {
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  // 도약석 (레이드에서는 귀속)
  if (reward.leapStones) {
    Object.entries(reward.leapStones).forEach(([item, amount]) => {
      total += (amount || 0) * (priceMap[item] || 0);
    });
  }

  return total;
};

// 보상 표와 시세를 곱해 합산 (골드 환산)
export function calcRewardGold(reward: Reward, priceMap: Record<string, number>, isRest: boolean = false): number {
  return calcChaosTradableGold(reward, priceMap, isRest) + calcChaosBoundGold(reward, priceMap, isRest) + calcGuardianTradableGold(reward, priceMap, isRest) + calcGuardianBoundGold(reward, priceMap, isRest) + calcRaidTradableGold(reward, priceMap) + calcRaidBoundGold(reward, priceMap);
} 