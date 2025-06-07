import { chaosDungeonRewards, guardianRewards } from './rewardTables';
import { raidRewards, RaidReward } from './raidTable';
import { Character } from '../services/api';

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

// 보석 아이템 키 매핑
const GEM_KEY_MAP: Record<string, string> = {
  '4': 'GEM_TIER_4',
  '3': 'GEM_TIER_3'
};

// 보석 아이템 키 변환 함수
const convertGemKey = (key: string): string => {
  return GEM_KEY_MAP[key] || key;
};

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
    Object.entries(reward.gems).forEach(([gemKey, amount]) => {
      const fullGemKey = convertGemKey(gemKey);
      total += (amount || 0) * (priceMap[fullGemKey] || 0);
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
    Object.entries(reward.gems).forEach(([gemKey, amount]) => {
      const fullGemKey = convertGemKey(gemKey);
      total += (amount || 0) * (priceMap[fullGemKey] || 0);
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
    Object.entries(reward.gems).forEach(([gemKey, amount]) => {
      const fullGemKey = convertGemKey(gemKey);
      total += (amount || 0) * (priceMap[fullGemKey] || 0);
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

// 총 보상 계산 함수
export const calculateTotalReward = (
  characters: Character[],
  selectedRaids: Record<string, string[]>,
  goldRewardStates: Record<string, boolean>,
  excludeStates: Record<string, boolean>,
  priceMap: Record<string, number>,
  chaosOption: number,
  guardianOption: number
) => {
  let totalTradableGold = 0;
  let totalBoundGold = 0;
  const tradableResourceRewards: Record<string, { count: number, goldValue: number }> = {};
  const boundResourceRewards: Record<string, { count: number, goldValue: number }> = {};

  characters.forEach(character => {
    if (!character || excludeStates[character.characterName]) return;

    // 카오스 던전 보상
    const chaosReward = getSuitableChaosReward(character.level);
    if (chaosReward && chaosOption !== 2) {
      const isRest = chaosOption === 1;
      totalTradableGold += calcChaosTradableGold(chaosReward, priceMap, isRest);
      totalBoundGold += calcChaosBoundGold(chaosReward, priceMap, isRest);
      updateResourceRewards(chaosReward, priceMap, isRest, tradableResourceRewards, boundResourceRewards);
    }

    // 가디언 토벌 보상
    const guardianReward = getSuitableGuardianReward(character.level);
    if (guardianReward && guardianOption !== 2) {
      const isRest = guardianOption === 1;
      totalTradableGold += calcGuardianTradableGold(guardianReward, priceMap, isRest);
      totalBoundGold += calcGuardianBoundGold(guardianReward, priceMap, isRest);
      updateResourceRewards(guardianReward, priceMap, isRest, tradableResourceRewards, boundResourceRewards);
    }

    // 레이드 보상
    const availableRaids = getAvailableRaids(character.level);
    const checkedRaids = selectedRaids[character.characterName] || [];
    availableRaids.forEach(raid => {
      if (checkedRaids.includes(raid.name)) {
        const reward = goldRewardStates[character.characterName] ? raid.goldReward : raid.nonGoldReward;
        totalTradableGold += calcRaidTradableGold(reward, priceMap);
        totalBoundGold += calcRaidBoundGold(reward, priceMap);
        updateResourceRewards(reward, priceMap, false, tradableResourceRewards, boundResourceRewards);
      }
    });
  });

  return {
    totalTradableGold,
    totalBoundGold,
    tradableResourceRewards,
    boundResourceRewards
  };
};

// 서버별 총 보상 계산 함수
export const calculateServerTotalReward = (
  server: string,
  characters: Character[],
  selectedRaids: Record<string, string[]>,
  goldRewardStates: Record<string, boolean>,
  excludeStates: Record<string, boolean>,
  priceMap: Record<string, number>,
  chaosOption: number,
  guardianOption: number
) => {
  let totalTradableGold = 0;
  let totalBoundGold = 0;

  characters.forEach(character => {
    if (!character || excludeStates[character.characterName]) return;

    // 카오스 던전 보상
    const chaosReward = getSuitableChaosReward(character.level);
    if (chaosReward && chaosOption !== 2) {
      const isRest = chaosOption === 1;
      totalTradableGold += calcChaosTradableGold(chaosReward, priceMap, isRest);
      totalBoundGold += calcChaosBoundGold(chaosReward, priceMap, isRest);
    }

    // 가디언 토벌 보상
    const guardianReward = getSuitableGuardianReward(character.level);
    if (guardianReward && guardianOption !== 2) {
      const isRest = guardianOption === 1;
      totalTradableGold += calcGuardianTradableGold(guardianReward, priceMap, isRest);
      totalBoundGold += calcGuardianBoundGold(guardianReward, priceMap, isRest);
    }

    // 레이드 보상
    const availableRaids = getAvailableRaids(character.level);
    const checkedRaids = selectedRaids[character.characterName] || [];
    availableRaids.forEach(raid => {
      if (checkedRaids.includes(raid.name)) {
        const reward = goldRewardStates[character.characterName] ? raid.goldReward : raid.nonGoldReward;
        totalTradableGold += calcRaidTradableGold(reward, priceMap);
        totalBoundGold += calcRaidBoundGold(reward, priceMap);
      }
    });
  });

  return { totalTradableGold, totalBoundGold };
};

// 리소스 보상 업데이트 헬퍼 함수
const updateResourceRewards = (
  reward: Reward,
  priceMap: Record<string, number>,
  isRest: boolean,
  tradableResources: Record<string, { count: number, goldValue: number }>,
  boundResources: Record<string, { count: number, goldValue: number }>
) => {
  const multiplier = isRest ? 14/3 : 7;

  // 골드 추가
  if (reward.gold) {
    if (!tradableResources['GOLD']) {
      tradableResources['GOLD'] = { count: 0, goldValue: 0 };
    }
    tradableResources['GOLD'].count += reward.gold * multiplier;
    tradableResources['GOLD'].goldValue += reward.gold * multiplier;
  }

  // 무기 강화석
  if (reward.weaponStones) {
    Object.entries(reward.weaponStones).forEach(([resource, count]) => {
      if (!tradableResources[resource]) {
        tradableResources[resource] = { count: 0, goldValue: 0 };
      }
      tradableResources[resource].count += count * multiplier;
      tradableResources[resource].goldValue += count * multiplier * (priceMap[resource] || 0);
    });
  }

  // 방어구 강화석
  if (reward.armorStones) {
    Object.entries(reward.armorStones).forEach(([resource, count]) => {
      if (!tradableResources[resource]) {
        tradableResources[resource] = { count: 0, goldValue: 0 };
      }
      tradableResources[resource].count += count * multiplier;
      tradableResources[resource].goldValue += count * multiplier * (priceMap[resource] || 0);
    });
  }

  // 파편
  if (reward.shards) {
    Object.entries(reward.shards).forEach(([resource, count]) => {
      if (!boundResources[resource]) {
        boundResources[resource] = { count: 0, goldValue: 0 };
      }
      boundResources[resource].count += count * multiplier;
      boundResources[resource].goldValue += count * multiplier * (priceMap[resource] || 0);
    });
  }

  // 도약석
  if (reward.leapStones) {
    Object.entries(reward.leapStones).forEach(([resource, count]) => {
      if (!boundResources[resource]) {
        boundResources[resource] = { count: 0, goldValue: 0 };
      }
      boundResources[resource].count += count * multiplier;
      boundResources[resource].goldValue += count * multiplier * (priceMap[resource] || 0);
    });
  }

  // 보석
  if (reward.gems) {
    Object.entries(reward.gems).forEach(([gemKey, count]) => {
      const fullGemKey = convertGemKey(gemKey);
      if (!boundResources[fullGemKey]) {
        boundResources[fullGemKey] = { count: 0, goldValue: 0 };
      }
      boundResources[fullGemKey].count += count * multiplier;
      boundResources[fullGemKey].goldValue += count * multiplier * (priceMap[fullGemKey] || 0);
    });
  }
}; 