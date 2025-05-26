import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Tabs, Tab } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { searchCharacter, Character as ApiCharacter } from '../services/api';
import { getSuitableChaosReward, getSuitableGuardianReward, calcRewardGold, getAvailableRaids, calcRaidReward, calcTradableGold, calcBoundGold } from '../utils/rewardCalculator';
import ResultCharacterCard from '../components/ResultCharacterCard';
import FilterAndToolsTab from '../components/FilterAndToolsTab';
import PriceTab from '../components/PriceTab';
import axios from 'axios';

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
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useSearchParams()[0];

  // 탭 상태
  const [tab, setTab] = useState(0); // 0: 결과, 1: 필터 및 도구, 2: 시세

  // 필터 및 도구 상태
  const [showTradableOnly, setShowTradableOnly] = useState(false);
  const [chaosOption, setChaosOption] = useState(0); // 0: 매일, 1: 휴게만, 2: 계산X
  const [guardianOption, setGuardianOption] = useState(0);
  const [batchExcludeLevel, setBatchExcludeLevel] = useState('');
  const [disabledServers, setDisabledServers] = useState<string[]>([]);

  // 시세 수정 상태
  const [customPriceMap, setCustomPriceMap] = useState<Record<string, number>>({});

  // 기본 시세 데이터
  const defaultResources = [
    { item: 'DESTINY_SHARD', avgPrice: 0 },
    { item: 'DESTINY_LEAPSTONE', avgPrice: 0 },
    { item: 'DESTINY_DESTRUCTION_STONE', avgPrice: 0 },
    { item: 'DESTINY_GUARDIAN_STONE', avgPrice: 0 },
    { item: '4', avgPrice: 0 },
  ];

  // 보상 계산 함수
  const calculateReward = React.useCallback((character: ApiCharacter) => {
    let totalTradableGold = 0;
    let totalBoundGold = 0;

    // 카오스 던전 보상 계산
    if (chaosOption !== 2) { // 2는 "계산하지 않음"
      const chaosReward = getSuitableChaosReward(character.level);
      if (chaosReward) {
        const isRest = chaosOption === 1; // 1은 "휴식 보상"
        totalTradableGold += calcTradableGold(chaosReward, customPriceMap, isRest);
        totalBoundGold += calcBoundGold(chaosReward, customPriceMap, isRest);
      }
    }

    // 가디언 토벌 보상 계산
    if (guardianOption !== 2) { // 2는 "계산하지 않음"
      const guardianReward = getSuitableGuardianReward(character.level);
      if (guardianReward) {
        const isRest = guardianOption === 1; // 1은 "휴식 보상"
        totalTradableGold += calcTradableGold(guardianReward, customPriceMap, isRest);
        totalBoundGold += calcBoundGold(guardianReward, customPriceMap, isRest);
      }
    }

    // 레이드 보상 계산
    const availableRaids = getAvailableRaids(character.level);
    const checkedRaids = selectedRaids[character.characterName] || [];
    const isGoldReward = goldRewardStates[character.characterName] || false;
    availableRaids.forEach(raid => {
      if (checkedRaids.includes(raid.name)) {
        totalTradableGold += calcTradableGold(isGoldReward ? raid.goldReward : raid.nonGoldReward, customPriceMap);
        totalBoundGold += calcBoundGold(isGoldReward ? raid.goldReward : raid.nonGoldReward, customPriceMap);
      }
    });

    return { totalTradableGold, totalBoundGold };
  }, [chaosOption, guardianOption, selectedRaids, goldRewardStates, customPriceMap]);

  // 서버 정렬 (골드 많은 순)
  const sortedServers = React.useMemo(() => {
    if (!data) return [];
    
    const serverGoldMap = Object.entries(data).map(([server, characters]) => {
      let totalGold = 0;
      characters.forEach(character => {
        if (excludeStates[character.characterName]) return;
        const { totalTradableGold, totalBoundGold } = calculateReward(character);
        totalGold += showTradableOnly ? totalTradableGold : totalTradableGold + totalBoundGold;
      });
      return { server, totalGold };
    });

    return serverGoldMap
      .sort((a, b) => b.totalGold - a.totalGold)
      .map(({ server }) => server);
  }, [data, calculateReward, excludeStates, showTradableOnly]);

  // 일괄 제외 핸들러
  const handleBatchExcludeByLevel = (level: number) => {
    if (!data) return;
    const newExclude = { ...excludeStates };
    Object.values(data).forEach(characters => {
      characters.forEach(character => {
        if (character.level < level) newExclude[character.characterName] = true;
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

  const fetchData = async () => {
    try {
      const name = searchParams.get('name');
      if (!name) {
        setError('닉네임이 필요합니다.');
        setLoading(false);
        return;
      }

      const response = await searchCharacter(name);
      if (!response || !response.expeditions?.expeditions) {
        setError('캐릭터를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      setData(response.expeditions.expeditions);
      setLoading(false);
    } catch (error: any) {
      console.error('캐릭터 검색 중 오류 발생:', error);
      if (error.response?.status === 404) {
        setError('캐릭터를 찾을 수 없습니다.');
      } else {
        setError('캐릭터 검색 중 오류가 발생했습니다.');
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  // 서버별로 구분해서 캐릭터 표시 + 보상 계산 (필터/서버 비활성화 적용)
  let totalTradableGold = 0;
  let totalBoundGold = 0;
  if (data) {
    sortedServers.forEach(server => {
      if (disabledServers.includes(server)) return;
      const characters = data[server];
      characters.forEach(character => {
        if (excludeStates[character.characterName]) return;
        const { totalTradableGold: charTradableGold, totalBoundGold: charBoundGold } = calculateReward(character);
        totalTradableGold += showTradableOnly ? charTradableGold : charTradableGold;
        totalBoundGold += showTradableOnly ? 0 : charBoundGold;
      });
    });
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="결과" />
          <Tab label="필터 및 도구" />
          <Tab label="시세" />
        </Tabs>

        {tab === 0 && (
          <>
            {/* 총 보상 */}
            <Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>총 보상</Typography>
              <Typography color="primary">거래 가능 골드: {totalTradableGold.toLocaleString()} G</Typography>
              <Typography color="primary">귀속 골드: {totalBoundGold.toLocaleString()} G</Typography>
            </Box>

            {data &&
              (Object.entries(data) as [string, ApiCharacter[]][]).map(([server, characters]) => (
                disabledServers.includes(server) ? null : (
                  <Box key={server} sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                      {server}
                    </Typography>
                    {characters.map((character, idx) => {
                      if (excludeStates[character.characterName]) return null;
                      const raids = getAvailableRaids(character.level, 6);
                      return (
                        <ResultCharacterCard
                          key={character.characterName}
                          character={character}
                          priceMap={customPriceMap}
                          raids={raids}
                          selectedRaids={selectedRaids[character.characterName] || []}
                          isGoldReward={goldRewardStates[character.characterName] || false}
                          isExcluded={excludeStates[character.characterName] || false}
                          onGoldRewardChange={handleGoldRewardChange}
                          onExcludeChange={handleExcludeChange}
                          onRaidCheck={handleRaidCheck}
                          getSuitableChaosReward={getSuitableChaosReward}
                          getSuitableGuardianReward={getSuitableGuardianReward}
                          calcTradableGold={calcTradableGold}
                          calcBoundGold={calcBoundGold}
                        />
                      );
                    })}
                  </Box>
                )
              ))}
          </>
        )}

        {tab === 1 && (
          <FilterAndToolsTab
            showTradableOnly={showTradableOnly}
            onShowTradableOnlyChange={setShowTradableOnly}
            chaosOption={chaosOption}
            onChaosOptionChange={setChaosOption}
            guardianOption={guardianOption}
            onGuardianOptionChange={setGuardianOption}
            batchExcludeLevel={batchExcludeLevel}
            onBatchExcludeLevelChange={setBatchExcludeLevel}
            onBatchExcludeByLevel={handleBatchExcludeByLevel}
            sortedServers={sortedServers}
            disabledServers={disabledServers}
            onDisabledServerChange={handleDisabledServerChange}
            onClose={() => setTab(0)}
          />
        )}

        {tab === 2 && (
          <PriceTab
            resources={defaultResources}
            priceMap={customPriceMap}
            onPriceChange={handlePriceChange}
            onClose={() => setTab(0)}
          />
        )}

        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            bgcolor: 'background.paper',
            boxShadow: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={handleHome}
          >
            <HomeIcon sx={{ mr: 1 }} />
            <Typography>홈</Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ResultPage; 