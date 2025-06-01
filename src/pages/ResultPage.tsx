import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Tabs, Tab, IconButton, Grid, Card, CardContent, TextField, InputAdornment, GridProps, Button, Collapse } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { searchCharacter, Character as ApiCharacter, Resource } from '../services/api';
import { Reward } from '../types';
import { 
  getSuitableChaosReward, 
  getSuitableGuardianReward, 
  getAvailableRaids,
  calcChaosTradableGold,
  calcChaosBoundGold,
  calcGuardianTradableGold,
  calcGuardianBoundGold,
  calcRaidTradableGold,
  calcRaidBoundGold
} from '../utils/rewardCalculator';
import ResultCharacterCard from '../components/ResultCharacterCard';
import FilterAndToolsTab from '../components/FilterAndToolsTab';
import PriceTab from '../components/PriceTab';
import TotalRewardCard from '../components/TotalRewardCard';
import ServerCard from '../components/ServerCard';
import SearchHeader from '../components/SearchHeader';

interface CharacterRaidState {
  [characterName: string]: string[]; // 선택된 레이드 이름 리스트
}

interface CharacterGoldState {
  [characterName: string]: boolean; // 골드 획득 여부
}

interface CharacterExcludeState {
  [characterName: string]: boolean; // 계산 제외 여부
}

interface ExpeditionData {
  [server: string]: ApiCharacter[];
}

interface Raid {
  name: string;
  minLevel: number;
  goldReward: any;
  nonGoldReward: any;
}

const ResultPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<ExpeditionData | null>(null);
  const [selectedRaids, setSelectedRaids] = useState<CharacterRaidState>({});
  const [goldRewardStates, setGoldRewardStates] = useState<CharacterGoldState>({});
  const [excludeStates, setExcludeStates] = useState<CharacterExcludeState>({});
  const [sortedServers, setSortedServers] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useSearchParams()[0];

  // 탭 상태
  const [tab, setTab] = useState(0); // 0: 결과, 1: 필터 및 도구, 2: 시세

  // 필터 및 도구 상태
  const [chaosOption, setChaosOption] = useState(0); // 0: 매일, 1: 휴게만, 2: 계산X
  const [guardianOption, setGuardianOption] = useState(0);
  const [batchExcludeLevel, setBatchExcludeLevel] = useState('');
  const [disabledServers, setDisabledServers] = useState<string[]>([]);
  const [batchRaidLevel, setBatchRaidLevel] = useState('');

  // 시세 수정 상태
  const [customPriceMap, setCustomPriceMap] = useState<Record<string, number>>({});

  // 기본 시세 데이터
  const [resources, setResources] = useState<Resource[]>([]);

  // 보상 계산 함수
  const calculateReward = React.useCallback((character: ApiCharacter) => {
    let totalTradableGold = 0;
    let totalBoundGold = 0;
    const resourceRewards: Record<string, { count: number, goldValue: number }> = {};

    // 카오스 던전 보상
    if (chaosOption !== 2) {
      const chaosReward = getSuitableChaosReward(character.level);
      if (chaosReward) {
        totalTradableGold += calcChaosTradableGold(chaosReward, customPriceMap, chaosOption === 1);
        totalBoundGold += calcChaosBoundGold(chaosReward, customPriceMap, chaosOption === 1);
      }
    }

    // 가디언 토벌 보상
    if (guardianOption !== 2) {
      const guardianReward = getSuitableGuardianReward(character.level);
      if (guardianReward) {
        totalTradableGold += calcGuardianTradableGold(guardianReward, customPriceMap, guardianOption === 1);
        totalBoundGold += calcGuardianBoundGold(guardianReward, customPriceMap, guardianOption === 1);
      }
    }

    // 레이드 보상
    const availableRaids = getAvailableRaids(character.level);
    const checkedRaids = selectedRaids[character.characterName] || [];
    const isGoldReward = goldRewardStates[character.characterName] || false;

    availableRaids.forEach(raid => {
      if (checkedRaids.includes(raid.name)) {
        totalTradableGold += calcRaidTradableGold(isGoldReward ? raid.goldReward : raid.nonGoldReward, customPriceMap);
        totalBoundGold += calcRaidBoundGold(isGoldReward ? raid.goldReward : raid.nonGoldReward, customPriceMap);
      }
    });

    return { totalTradableGold, totalBoundGold, resourceRewards };
  }, [chaosOption, guardianOption, selectedRaids, goldRewardStates, customPriceMap]);

  const fetchData = async () => {
    try {
      const name = searchParams.get('name');
      if (!name) {
        navigate('/', { state: { error: '닉네임이 필요합니다.' } });
        return;
      }

      const response = await searchCharacter(name);
      if (!response || !response.expeditions?.expeditions) {
        navigate('/', { state: { error: '캐릭터를 찾을 수 없습니다.' } });
        return;
      }

      // API 응답의 resources를 초기 시세 데이터로 설정
      setResources(response.resources || []);
      const initialPriceMap: Record<string, number> = {};
      (response.resources || []).forEach(resource => {
        initialPriceMap[resource.item] = resource.avgPrice;
      });
      setCustomPriceMap(initialPriceMap);

      // 최초 계산 시 골드 수급량이 0G인 캐릭터 필터링
      const filteredExpeditions: ExpeditionData = {};
      Object.entries(response.expeditions.expeditions).forEach(([server, characters]) => {
        const filteredCharacters = characters.filter(character => {
          let totalTradableGold = 0;
          let totalBoundGold = 0;

          // 카오스 던전 보상
          const chaosReward = getSuitableChaosReward(character.level);
          if (chaosReward) {
            totalTradableGold += calcChaosTradableGold(chaosReward, initialPriceMap, false);
            totalBoundGold += calcChaosBoundGold(chaosReward, initialPriceMap, false);
          }

          // 가디언 토벌 보상
          const guardianReward = getSuitableGuardianReward(character.level);
          if (guardianReward) {
            totalTradableGold += calcGuardianTradableGold(guardianReward, initialPriceMap, false);
            totalBoundGold += calcGuardianBoundGold(guardianReward, initialPriceMap, false);
          }

          // 레이드 보상
          const availableRaids = getAvailableRaids(character.level);
          const topThreeRaids = availableRaids.slice(0, 3);
          topThreeRaids.forEach(raid => {
            totalTradableGold += calcRaidTradableGold(raid.goldReward, initialPriceMap);
            totalBoundGold += calcRaidBoundGold(raid.goldReward, initialPriceMap);
          });

          return totalTradableGold + totalBoundGold > 0;
        });
        if (filteredCharacters.length > 0) {
          filteredExpeditions[server] = filteredCharacters;
        }
      });

      setData(filteredExpeditions);

      // 서버 정렬 (골드 많은 순)
      const serverGoldMap = Object.entries(filteredExpeditions).map(([server, characters]) => {
        let totalGold = 0;
        characters.forEach(character => {
          let totalTradableGold = 0;
          let totalBoundGold = 0;

          // 카오스 던전 보상
          const chaosReward = getSuitableChaosReward(character.level);
          if (chaosReward) {
            totalTradableGold += calcChaosTradableGold(chaosReward, initialPriceMap, false);
            totalBoundGold += calcChaosBoundGold(chaosReward, initialPriceMap, false);
          }

          // 가디언 토벌 보상
          const guardianReward = getSuitableGuardianReward(character.level);
          if (guardianReward) {
            totalTradableGold += calcGuardianTradableGold(guardianReward, initialPriceMap, false);
            totalBoundGold += calcGuardianBoundGold(guardianReward, initialPriceMap, false);
          }

          // 레이드 보상
          const availableRaids = getAvailableRaids(character.level);
          const topThreeRaids = availableRaids.slice(0, 3);
          topThreeRaids.forEach(raid => {
            totalTradableGold += calcRaidTradableGold(raid.goldReward, initialPriceMap);
            totalBoundGold += calcRaidBoundGold(raid.goldReward, initialPriceMap);
          });

          totalGold += totalTradableGold + totalBoundGold;
        });
        return { server, totalGold };
      });

      const sorted = serverGoldMap
        .sort((a, b) => b.totalGold - a.totalGold)
        .map(({ server }) => server);

      setSortedServers(sorted);

      // 각 서버별로 레벨이 높은 상위 6개 캐릭터에 대해서만 초기화
      Object.entries(filteredExpeditions).forEach(([server, characters]) => {
        // 레벨 기준으로 정렬하고 상위 6개 선택
        const topCharacters = [...characters]
          .sort((a, b) => b.level - a.level)
          .slice(0, 6);

        // 선택된 캐릭터들에 대해서만 초기화
        topCharacters.forEach(character => {
          // 레이드 선택 초기화
          initializeSelectedRaids(character);
          // 골드 획득 옵션 활성화
          setGoldRewardStates(prev => ({
            ...prev,
            [character.characterName]: true
          }));
        });
      });

      setLoading(false);
    } catch (error: any) {
      console.error('캐릭터 검색 중 오류 발생:', error);
      if (error.response?.status === 404) {
        navigate('/', { state: { error: '캐릭터를 찾을 수 없습니다.' } });
      } else {
        navigate('/', { state: { error: '캐릭터 검색 중 오류가 발생했습니다.' } });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const handleHome = () => {
    navigate('/');
  };

  // 골드 획득 상태 변경 핸들러
  const handleGoldRewardChange = (characterName: string) => {
    setGoldRewardStates(prev => ({
      ...prev,
      [characterName]: !prev[characterName]
    }));
  };

  // 계산 제외 상태 변경 핸들러
  const handleExcludeChange = (characterName: string) => {
    setExcludeStates(prev => ({
      ...prev,
      [characterName]: !prev[characterName]
    }));
  };

  // 레이드 체크박스 상태 변경 핸들러
  const handleRaidCheck = (characterName: string, raidName: string) => {
    setSelectedRaids((prev) => {
      const prevList = prev[characterName] || [];
      if (prevList.includes(raidName)) {
        return { ...prev, [characterName]: prevList.filter((n) => n !== raidName) };
      } else {
        return { ...prev, [characterName]: [...prevList, raidName] };
      }
    });
  };

  const [expandedServers, setExpandedServers] = useState<Record<string, boolean>>({});
  const [expandedCharacters, setExpandedCharacters] = useState<Record<string, boolean>>({});

  // 데이터가 로드될 때 서버 토글 상태 초기화
  useEffect(() => {
    if (data) {
      const initial: Record<string, boolean> = {};
      Object.keys(data).forEach(server => {
        initial[server] = true;
      });
      setExpandedServers(initial);
    }
  }, [data]);

  // 서버 토글 핸들러
  const handleServerToggle = (server: string) => {
    setExpandedServers(prev => ({
      ...prev,
      [server]: !prev[server]
    }));
  };

  // 캐릭터 토글 핸들러
  const handleCharacterToggle = (server: string, characterName: string) => {
    if (!data || !data[server]) return;

    const characters = data[server];
    const characterIndex = characters.findIndex(char => char.characterName === characterName);
    if (characterIndex === -1) return;

    // 같은 행의 다른 캐릭터 찾기
    const isEvenIndex = characterIndex % 2 === 0;
    const pairIndex = isEvenIndex ? characterIndex + 1 : characterIndex - 1;
    
    // 같은 행의 캐릭터가 있는 경우에만 토글
    if (pairIndex >= 0 && pairIndex < characters.length) {
      const pairCharacter = characters[pairIndex];
      const isCurrentlyExpanded = expandedCharacters[characterName];
      
      setExpandedCharacters(prev => ({
        ...prev,
        [characterName]: !isCurrentlyExpanded,
        [pairCharacter.characterName]: !isCurrentlyExpanded
      }));
    } else {
      // 짝이 없는 경우 해당 캐릭터만 토글
      setExpandedCharacters(prev => ({
        ...prev,
        [characterName]: !prev[characterName]
      }));
    }
  };

  // 필터 및 도구 상태 변경 핸들러
  const handleChaosOptionChange = (value: number) => {
    console.log('카오스 던전 옵션 변경:', value);
    setChaosOption(value);
  };

  const handleGuardianOptionChange = (value: number) => {
    console.log('가디언 토벌 옵션 변경:', value);
    setGuardianOption(value);
  };

  // 일괄 레이드 입장 핸들러
  const handleBatchRaidByLevel = (level: number) => {
    if (!data) return;
    const newSelectedRaids = { ...selectedRaids };
    Object.values(data).forEach(characters => {
      characters.forEach(character => {
        const availableRaids = getAvailableRaids(character.level);
        if (character.level >= level) {
          // 레벨 이상 캐릭터는 상위 3개 레이드 체크
          newSelectedRaids[character.characterName] = availableRaids.slice(0, 3).map(raid => raid.name);
        } else {
          // 레벨 미만 캐릭터는 모든 레이드 체크 해제
          newSelectedRaids[character.characterName] = [];
        }
      });
    });
    setSelectedRaids(newSelectedRaids);
  };

  // 보상 계산 함수들
  const calculateTotalReward = React.useCallback(() => {
    let totalTradableGold = 0;
    let totalBoundGold = 0;
    const tradableResourceRewards: Record<string, { count: number, goldValue: number }> = {};
    const boundResourceRewards: Record<string, { count: number, goldValue: number }> = {};

    if (data) {
      sortedServers.forEach(server => {
        if (disabledServers.includes(server)) return;
        const characters = data[server];
        characters.forEach(character => {
          if (excludeStates[character.characterName]) return;

          // 카오스 던전 보상
          if (chaosOption !== 2) {
            const chaosReward = getSuitableChaosReward(character.level);
            if (chaosReward) {
              totalTradableGold += calcChaosTradableGold(chaosReward, customPriceMap, chaosOption === 1);
              totalBoundGold += calcChaosBoundGold(chaosReward, customPriceMap, chaosOption === 1);

              // 거래 가능 재화 집계
              if (chaosReward.gold) {
                if (!tradableResourceRewards['GOLD']) tradableResourceRewards['GOLD'] = { count: 0, goldValue: 0 };
                tradableResourceRewards['GOLD'].count += chaosReward.gold;
                tradableResourceRewards['GOLD'].goldValue += chaosReward.gold;
              }
              if (chaosReward.weaponStones) {
                Object.entries(chaosReward.weaponStones).forEach(([resource, count]) => {
                  if (!tradableResourceRewards[resource]) tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                  tradableResourceRewards[resource].count += count;
                  tradableResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
              if (chaosReward.armorStones) {
                Object.entries(chaosReward.armorStones).forEach(([resource, count]) => {
                  if (!tradableResourceRewards[resource]) tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                  tradableResourceRewards[resource].count += count;
                  tradableResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
              if (chaosReward.gems) {
                Object.entries(chaosReward.gems).forEach(([grade, count]) => {
                  const resource = `GEM_TIER_${grade}`;
                  if (!tradableResourceRewards[resource]) tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                  tradableResourceRewards[resource].count += count;
                  tradableResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
              // 귀속 재화 집계
              if (chaosReward.shards) {
                Object.entries(chaosReward.shards).forEach(([resource, count]) => {
                  if (!boundResourceRewards[resource]) boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                  boundResourceRewards[resource].count += count;
                  boundResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
              if (chaosReward.leapStones) {
                Object.entries(chaosReward.leapStones).forEach(([resource, count]) => {
                  if (!boundResourceRewards[resource]) boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                  boundResourceRewards[resource].count += count;
                  boundResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
            }
          }

          // 가디언 토벌 보상
          if (guardianOption !== 2) {
            const guardianReward = getSuitableGuardianReward(character.level);
            if (guardianReward) {
              totalTradableGold += calcGuardianTradableGold(guardianReward, customPriceMap, guardianOption === 1);
              totalBoundGold += calcGuardianBoundGold(guardianReward, customPriceMap, guardianOption === 1);

              // 거래 가능 재화 집계
              if (guardianReward.gold) {
                if (!tradableResourceRewards['GOLD']) tradableResourceRewards['GOLD'] = { count: 0, goldValue: 0 };
                tradableResourceRewards['GOLD'].count += guardianReward.gold;
                tradableResourceRewards['GOLD'].goldValue += guardianReward.gold;
              }
              if (guardianReward.weaponStones) {
                Object.entries(guardianReward.weaponStones).forEach(([resource, count]) => {
                  if (!tradableResourceRewards[resource]) tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                  tradableResourceRewards[resource].count += count;
                  tradableResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
              if (guardianReward.armorStones) {
                Object.entries(guardianReward.armorStones).forEach(([resource, count]) => {
                  if (!tradableResourceRewards[resource]) tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                  tradableResourceRewards[resource].count += count;
                  tradableResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
              if (guardianReward.leapStones) {
                Object.entries(guardianReward.leapStones).forEach(([resource, count]) => {
                  if (!tradableResourceRewards[resource]) tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                  tradableResourceRewards[resource].count += count;
                  tradableResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
              if (guardianReward.gems) {
                Object.entries(guardianReward.gems).forEach(([grade, count]) => {
                  const resource = `GEM_TIER_${grade}`;
                  if (!tradableResourceRewards[resource]) tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                  tradableResourceRewards[resource].count += count;
                  tradableResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
              // 귀속 재화 집계
              if (guardianReward.shards) {
                Object.entries(guardianReward.shards).forEach(([resource, count]) => {
                  if (!boundResourceRewards[resource]) boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                  boundResourceRewards[resource].count += count;
                  boundResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
            }
          }

          // 레이드 보상
          const availableRaids = getAvailableRaids(character.level);
          const checkedRaids = selectedRaids[character.characterName] || [];
          const isGoldReward = goldRewardStates[character.characterName] || false;

          availableRaids.forEach(raid => {
            if (checkedRaids.includes(raid.name)) {
              const reward: Reward = isGoldReward ? raid.goldReward : raid.nonGoldReward;
              totalTradableGold += calcRaidTradableGold(reward, customPriceMap);
              totalBoundGold += calcRaidBoundGold(reward, customPriceMap);

              // 거래 가능 재화 집계
              if (reward.gold) {
                if (!tradableResourceRewards['GOLD']) tradableResourceRewards['GOLD'] = { count: 0, goldValue: 0 };
                tradableResourceRewards['GOLD'].count += reward.gold;
                tradableResourceRewards['GOLD'].goldValue += reward.gold;
              }
              if (reward.gems) {
                Object.entries(reward.gems).forEach(([grade, count]) => {
                  const resource = `GEM_TIER_${grade}`;
                  if (!tradableResourceRewards[resource]) tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                  tradableResourceRewards[resource].count += count;
                  tradableResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
              // 귀속 재화 집계
              if (reward.shards) {
                Object.entries(reward.shards).forEach(([resource, count]) => {
                  if (!boundResourceRewards[resource]) boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                  boundResourceRewards[resource].count += count;
                  boundResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
              if (reward.weaponStones) {
                Object.entries(reward.weaponStones).forEach(([resource, count]) => {
                  if (!boundResourceRewards[resource]) boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                  boundResourceRewards[resource].count += count;
                  boundResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
              if (reward.armorStones) {
                Object.entries(reward.armorStones).forEach(([resource, count]) => {
                  if (!boundResourceRewards[resource]) boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                  boundResourceRewards[resource].count += count;
                  boundResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
              if (reward.leapStones) {
                Object.entries(reward.leapStones).forEach(([resource, count]) => {
                  if (!boundResourceRewards[resource]) boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                  boundResourceRewards[resource].count += count;
                  boundResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
            }
          });
        });
      });
    }

    return { totalTradableGold, totalBoundGold, tradableResourceRewards, boundResourceRewards };
  }, [data, sortedServers, disabledServers, excludeStates, chaosOption, guardianOption, selectedRaids, goldRewardStates, customPriceMap]);

  const calculateRaidReward = React.useCallback(() => {
    let totalTradableGold = 0;
    let totalBoundGold = 0;
    const tradableResourceRewards: Record<string, { count: number, goldValue: number }> = {};
    const boundResourceRewards: Record<string, { count: number, goldValue: number }> = {};

    if (data) {
      sortedServers.forEach(server => {
        if (disabledServers.includes(server)) return;
        const characters = data[server];
        characters.forEach(character => {
          if (excludeStates[character.characterName]) return;
          const availableRaids = getAvailableRaids(character.level);
          const checkedRaids = selectedRaids[character.characterName] || [];
          const isGoldReward = goldRewardStates[character.characterName] || false;

          availableRaids.forEach(raid => {
            if (checkedRaids.includes(raid.name)) {
              const reward: Reward = isGoldReward ? raid.goldReward : raid.nonGoldReward;
              totalTradableGold += calcRaidTradableGold(reward, customPriceMap);
              totalBoundGold += calcRaidBoundGold(reward, customPriceMap);

              // 거래 가능 재화 집계
              if (reward.gold) {
                if (!tradableResourceRewards['GOLD']) tradableResourceRewards['GOLD'] = { count: 0, goldValue: 0 };
                tradableResourceRewards['GOLD'].count += reward.gold;
                tradableResourceRewards['GOLD'].goldValue += reward.gold;
              }
              if (reward.gems) {
                Object.entries(reward.gems).forEach(([grade, count]) => {
                  const resource = `GEM_TIER_${grade}`;
                  if (!tradableResourceRewards[resource]) tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                  tradableResourceRewards[resource].count += count;
                  tradableResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
              // 귀속 재화 집계
              if (reward.shards) {
                Object.entries(reward.shards).forEach(([resource, count]) => {
                  if (!boundResourceRewards[resource]) boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                  boundResourceRewards[resource].count += count;
                  boundResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
              if (reward.weaponStones) {
                Object.entries(reward.weaponStones).forEach(([resource, count]) => {
                  if (!boundResourceRewards[resource]) boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                  boundResourceRewards[resource].count += count;
                  boundResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
              if (reward.armorStones) {
                Object.entries(reward.armorStones).forEach(([resource, count]) => {
                  if (!boundResourceRewards[resource]) boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                  boundResourceRewards[resource].count += count;
                  boundResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
              if (reward.leapStones) {
                Object.entries(reward.leapStones).forEach(([resource, count]) => {
                  if (!boundResourceRewards[resource]) boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                  boundResourceRewards[resource].count += count;
                  boundResourceRewards[resource].goldValue += count * (customPriceMap[resource] || 0);
                });
              }
            }
          });
        });
      });
    }

    return { totalTradableGold, totalBoundGold, tradableResourceRewards, boundResourceRewards };
  }, [data, sortedServers, disabledServers, excludeStates, selectedRaids, goldRewardStates, customPriceMap]);

  const calculateChaosReward = React.useCallback(() => {
    let totalTradableGold = 0;
    let totalBoundGold = 0;
    const tradableResourceRewards: Record<string, { count: number, goldValue: number }> = {};
    const boundResourceRewards: Record<string, { count: number, goldValue: number }> = {};

    // multiplier 결정
    const chaosMultiplier = chaosOption === 1 ? 14/3 : chaosOption === 2 ? 0 : 7;

    if (data) {
      sortedServers.forEach(server => {
        if (disabledServers.includes(server)) return;
        const characters = data[server];
        characters.forEach(character => {
          if (excludeStates[character.characterName]) return;
          if (chaosOption !== 2) {
            const chaosReward = getSuitableChaosReward(character.level);
            if (chaosReward) {
              totalTradableGold += calcChaosTradableGold(chaosReward, customPriceMap, chaosOption === 1);
              totalBoundGold += calcChaosBoundGold(chaosReward, customPriceMap, chaosOption === 1);

              // 거래 가능 재화 집계
              if (chaosReward.gold) {
                if (!tradableResourceRewards['GOLD']) tradableResourceRewards['GOLD'] = { count: 0, goldValue: 0 };
                tradableResourceRewards['GOLD'].count += chaosReward.gold * chaosMultiplier;
                tradableResourceRewards['GOLD'].goldValue += chaosReward.gold * chaosMultiplier;
              }
              if (chaosReward.weaponStones) {
                Object.entries(chaosReward.weaponStones).forEach(([resource, count]) => {
                  if (!tradableResourceRewards[resource]) tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                  tradableResourceRewards[resource].count += count * chaosMultiplier;
                  tradableResourceRewards[resource].goldValue += count * chaosMultiplier * (customPriceMap[resource] || 0);
                });
              }
              if (chaosReward.armorStones) {
                Object.entries(chaosReward.armorStones).forEach(([resource, count]) => {
                  if (!tradableResourceRewards[resource]) tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                  tradableResourceRewards[resource].count += count * chaosMultiplier;
                  tradableResourceRewards[resource].goldValue += count * chaosMultiplier * (customPriceMap[resource] || 0);
                });
              }
              if (chaosReward.gems) {
                Object.entries(chaosReward.gems).forEach(([grade, count]) => {
                  const resource = `GEM_TIER_${grade}`;
                  if (!tradableResourceRewards[resource]) tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                  tradableResourceRewards[resource].count += count * chaosMultiplier;
                  tradableResourceRewards[resource].goldValue += count * chaosMultiplier * (customPriceMap[resource] || 0);
                });
              }
              // 귀속 재화 집계
              if (chaosReward.shards) {
                Object.entries(chaosReward.shards).forEach(([resource, count]) => {
                  if (!boundResourceRewards[resource]) boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                  boundResourceRewards[resource].count += count * chaosMultiplier;
                  boundResourceRewards[resource].goldValue += count * chaosMultiplier * (customPriceMap[resource] || 0);
                });
              }
              if (chaosReward.leapStones) {
                Object.entries(chaosReward.leapStones).forEach(([resource, count]) => {
                  if (!boundResourceRewards[resource]) boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                  boundResourceRewards[resource].count += count * chaosMultiplier;
                  boundResourceRewards[resource].goldValue += count * chaosMultiplier * (customPriceMap[resource] || 0);
                });
              }
            }
          }
        });
      });
    }

    return { totalTradableGold, totalBoundGold, tradableResourceRewards, boundResourceRewards };
  }, [data, sortedServers, disabledServers, excludeStates, chaosOption, customPriceMap]);

  const calculateGuardianReward = React.useCallback(() => {
    let totalTradableGold = 0;
    let totalBoundGold = 0;
    const tradableResourceRewards: Record<string, { count: number, goldValue: number }> = {};
    const boundResourceRewards: Record<string, { count: number, goldValue: number }> = {};

    // multiplier 결정
    const guardianMultiplier = guardianOption === 1 ? 14/3 : guardianOption === 2 ? 0 : 7;

    if (data) {
      sortedServers.forEach(server => {
        if (disabledServers.includes(server)) return;
        const characters = data[server];
        characters.forEach(character => {
          if (excludeStates[character.characterName]) return;
          if (guardianOption !== 2) {
            const guardianReward = getSuitableGuardianReward(character.level);
            if (guardianReward) {
              totalTradableGold += calcGuardianTradableGold(guardianReward, customPriceMap, guardianOption === 1);
              totalBoundGold += calcGuardianBoundGold(guardianReward, customPriceMap, guardianOption === 1);

              // 거래 가능 재화 집계
              if (guardianReward.gold) {
                if (!tradableResourceRewards['GOLD']) tradableResourceRewards['GOLD'] = { count: 0, goldValue: 0 };
                tradableResourceRewards['GOLD'].count += guardianReward.gold * guardianMultiplier;
                tradableResourceRewards['GOLD'].goldValue += guardianReward.gold * guardianMultiplier;
              }
              if (guardianReward.weaponStones) {
                Object.entries(guardianReward.weaponStones).forEach(([resource, count]) => {
                  if (!tradableResourceRewards[resource]) tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                  tradableResourceRewards[resource].count += count * guardianMultiplier;
                  tradableResourceRewards[resource].goldValue += count * guardianMultiplier * (customPriceMap[resource] || 0);
                });
              }
              if (guardianReward.armorStones) {
                Object.entries(guardianReward.armorStones).forEach(([resource, count]) => {
                  if (!tradableResourceRewards[resource]) tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                  tradableResourceRewards[resource].count += count * guardianMultiplier;
                  tradableResourceRewards[resource].goldValue += count * guardianMultiplier * (customPriceMap[resource] || 0);
                });
              }
              if (guardianReward.leapStones) {
                Object.entries(guardianReward.leapStones).forEach(([resource, count]) => {
                  if (!tradableResourceRewards[resource]) tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                  tradableResourceRewards[resource].count += count * guardianMultiplier;
                  tradableResourceRewards[resource].goldValue += count * guardianMultiplier * (customPriceMap[resource] || 0);
                });
              }
              if (guardianReward.gems) {
                Object.entries(guardianReward.gems).forEach(([grade, count]) => {
                  const resource = `GEM_TIER_${grade}`;
                  if (!tradableResourceRewards[resource]) tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                  tradableResourceRewards[resource].count += count * guardianMultiplier;
                  tradableResourceRewards[resource].goldValue += count * guardianMultiplier * (customPriceMap[resource] || 0);
                });
              }
              // 귀속 재화 집계
              if (guardianReward.shards) {
                Object.entries(guardianReward.shards).forEach(([resource, count]) => {
                  if (!boundResourceRewards[resource]) boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                  boundResourceRewards[resource].count += count * guardianMultiplier;
                  boundResourceRewards[resource].goldValue += count * guardianMultiplier * (customPriceMap[resource] || 0);
                });
              }
            }
          }
        });
      });
    }

    return { totalTradableGold, totalBoundGold, tradableResourceRewards, boundResourceRewards };
  }, [data, sortedServers, disabledServers, excludeStates, guardianOption, customPriceMap]);

  // 서버별 총 보상 계산
  const calculateServerTotalReward = React.useCallback((server: string) => {
    if (!data || !data[server]) return { totalTradableGold: 0, totalBoundGold: 0 };

    let totalTradableGold = 0;
    let totalBoundGold = 0;

    data[server].forEach(character => {
      if (excludeStates[character.characterName]) return;

      // 카오스 던전 보상
      const chaosReward = getSuitableChaosReward(character.level);
      if (chaosReward && chaosOption !== 2) {
        const isRest = chaosOption === 1;
        totalTradableGold += calcChaosTradableGold(chaosReward, customPriceMap, isRest);
        totalBoundGold += calcChaosBoundGold(chaosReward, customPriceMap, isRest);
      }

      // 가디언 토벌 보상
      const guardianReward = getSuitableGuardianReward(character.level);
      if (guardianReward && guardianOption !== 2) {
        const isRest = guardianOption === 1;
        totalTradableGold += calcGuardianTradableGold(guardianReward, customPriceMap, isRest);
        totalBoundGold += calcGuardianBoundGold(guardianReward, customPriceMap, isRest);
      }

      // 레이드 보상
      const availableRaids = getAvailableRaids(character.level);
      const checkedRaids = selectedRaids[character.characterName] || [];
      availableRaids.forEach(raid => {
        if (checkedRaids.includes(raid.name)) {
          const reward = goldRewardStates[character.characterName] ? raid.goldReward : raid.nonGoldReward;
          totalTradableGold += calcRaidTradableGold(reward, customPriceMap);
          totalBoundGold += calcRaidBoundGold(reward, customPriceMap);
        }
      });
    });

    return { totalTradableGold, totalBoundGold };
  }, [data, excludeStates, chaosOption, guardianOption, selectedRaids, goldRewardStates, customPriceMap]);

  // 일괄 제외 핸들러
  const handleBatchExcludeByLevel = (level: number) => {
    if (!data) return;
    const newExclude = { ...excludeStates };
    Object.values(data).forEach(characters => {
      characters.forEach(character => {
        if (character.level < level) {
          newExclude[character.characterName] = true;
        } else {
          newExclude[character.characterName] = false;
        }
      });
    });
    setExcludeStates(newExclude);
  };

  // 서버 비활성화 핸들러
  const handleDisabledServerChange = (server: string, checked: boolean) => {
    setDisabledServers(prev => checked ? [...prev, server] : prev.filter(s => s !== server));
  };

  // 시세 수정 핸들러
  const handlePriceChange = (item: string, value: number) => {
    setCustomPriceMap(prev => ({ ...prev, [item]: value }));
  };

  // 초기 레이드 선택 상태 설정
  const initializeSelectedRaids = React.useCallback((character: ApiCharacter) => {
    const availableRaids = getAvailableRaids(character.level);
    const topThreeRaids = availableRaids.slice(0, 3).map(raid => raid.name);
    setSelectedRaids(prev => ({
      ...prev,
      [character.characterName]: topThreeRaids
    }));
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <img 
          src="/images/common/laptop_mokoko.png" 
          alt="로딩중" 
          style={{ 
            width: 'auto',
            height: 200,
            display: 'block'
          }}
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'primary.main',
            fontWeight: 'bold'
          }}
        >
          데이터를 불러오는 중입니다...
        </Typography>
      </Box>
    );
  }

  if (error) {
    navigate('/', { state: { error } });
    return null;
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SearchHeader
        tab={tab}
        onTabChange={(_, newValue) => setTab(newValue)}
        searchQuery={searchParams.get('name') || ''}
        setSearchQuery={(value) => {
          navigate(`/result?name=${value}`);
        }}
        totalTradableGold={calculateTotalReward().totalTradableGold}
        totalBoundGold={calculateTotalReward().totalBoundGold}
      />
      <Box 
        sx={{ 
          mt: '120px',
          p: 2,
          flex: 1,
          overflow: 'auto',
          maxWidth: '1200px',
          mx: 'auto',
          width: '100%',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {tab === 0 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: 2 }}>
            {sortedServers.map(server => (
              <ServerCard
                key={server}
                server={server}
                characters={data?.[server] || []}
                expanded={expandedServers[server] || false}
                onToggle={() => handleServerToggle(server)}
                selectedRaids={selectedRaids}
                goldRewardStates={goldRewardStates}
                excludeStates={excludeStates}
                onRaidCheck={handleRaidCheck}
                onGoldRewardChange={handleGoldRewardChange}
                onExcludeChange={handleExcludeChange}
                priceMap={customPriceMap}
                getAvailableRaids={getAvailableRaids}
                getSuitableChaosReward={getSuitableChaosReward}
                getSuitableGuardianReward={getSuitableGuardianReward}
                chaosOption={chaosOption}
                guardianOption={guardianOption}
                expandedCharacters={expandedCharacters}
                onCharacterToggle={handleCharacterToggle}
                calculateServerTotalReward={calculateServerTotalReward}
              />
            ))}
          </Box>
        )}

        {tab === 1 && (
          <TotalRewardCard
            calculateTotalReward={calculateTotalReward}
            calculateRaidReward={calculateRaidReward}
            calculateChaosReward={calculateChaosReward}
            calculateGuardianReward={calculateGuardianReward}
            resources={resources}
          />
        )}

        {tab === 2 && (
          <FilterAndToolsTab
            chaosOption={chaosOption}
            onChaosOptionChange={handleChaosOptionChange}
            guardianOption={guardianOption}
            onGuardianOptionChange={handleGuardianOptionChange}
            batchExcludeLevel={batchExcludeLevel}
            onBatchExcludeLevelChange={setBatchExcludeLevel}
            onBatchExcludeByLevel={handleBatchExcludeByLevel}
            batchRaidLevel={batchRaidLevel}
            onBatchRaidLevelChange={setBatchRaidLevel}
            onBatchRaidByLevel={handleBatchRaidByLevel}
          />
        )}

        {tab === 3 && (
          <PriceTab
            resources={resources}
            priceMap={customPriceMap}
            onPriceChange={handlePriceChange}
            onClose={() => {}}
          />
        )}
      </Box>
    </Box>
  );
};

export default ResultPage; 