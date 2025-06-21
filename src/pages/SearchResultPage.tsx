import React, {useEffect, useMemo, useState} from 'react';
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Tabs,
    Tab,
    IconButton,
    Grid,
    Card,
    CardContent,
    TextField,
    InputAdornment,
    GridProps,
    Button,
    Collapse,
    useTheme,
    useMediaQuery,
    GlobalStyles
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {searchCharacter, Character, Resource, SearchResponse, renewExpeditionCharacters} from '../services/api';
import {Reward} from '../types';
import {
    getSuitableChaosReward,
    getSuitableGuardianReward,
    getAvailableRaids,
    calcChaosTradableGold,
    calcChaosBoundGold,
    calcGuardianTradableGold,
    calcGuardianBoundGold,
    calcRaidTradableGold,
    calcRaidBoundGold,
    calculateTotalReward,
    calculateServerTotalReward
} from '../utils/rewardCalculator';
import ResultCharacterCard from '../components/searchResultPage/ResultCharacterCard';
import OptionTab from '../components/searchResultPage/OptionTab';
import PriceTab from '../components/common/PriceTab';
import TotalRewardCard from '../components/searchResultPage/TotalRewardCard';
import ServerCard from '../components/searchResultPage/ServerCard';
import SearchResultHeader from '../components/searchResultPage/SearchResultHeader';
import { useHead } from '../hooks/useHead'

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
    [server: string]: Character[];
}

interface Raid {
    name: string;
    minLevel: number;
    goldReward: any;
    nonGoldReward: any;
}

const SearchResultPage: React.FC = () => {
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const name = queryParams.get('name') || '';

    const headConfig = useMemo(() => ({
        title: `계산 결과 | 로생계산기`,
        canonical: `https://www.loalife.co.kr/result${search}`,
        metas: [
            { name: 'description', content: `${name}님의 주간 수급량 계산 결과입니다.` },
            { name: 'robots',      content: 'noindex,follow' },
        ],
        scripts: [
            {
                innerHTML: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "url": `https://www.loalife.co.kr/result${search}`,
                    "name": `계산 결과 | 로생계산기`,
                    "description": `${name}님의 주간 수급량 계산 결과입니다.`,
                })
            }
        ]
    }), [search, name])

    useHead(headConfig);

    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width:800px)');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState<SearchResponse | null>(null);
    const [selectedRaids, setSelectedRaids] = useState<CharacterRaidState>({});
    const [goldRewardStates, setGoldRewardStates] = useState<CharacterGoldState>({});
    const [excludeStates, setExcludeStates] = useState<CharacterExcludeState>({});
    const [sortedServers, setSortedServers] = useState<string[]>([]);
    const [excludedServers, setExcludedServers] = useState<Record<string, boolean>>({});
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
    const calculateReward = React.useCallback((character: Character) => {
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

        return {totalTradableGold, totalBoundGold, resourceRewards};
    }, [chaosOption, guardianOption, selectedRaids, goldRewardStates, customPriceMap]);

    const fetchData = async () => {
        try {
            setLoading(true);

            const response = await searchCharacter(searchParams.get('name') || '');

            // 필터링된 데이터 생성
            const filteredExpeditions = {
                expeditions: {
                    expeditions: Object.entries(response.expeditions.expeditions).reduce((acc, [server, characters]) => {
                        // 레벨 1370 이상 캐릭터만 필터링
                        const filteredCharacters = characters.filter((char: Character) => {
                            const isValid = char.level >= 1370;
                            if (!isValid) {
                                console.log(`Filtered out character: ${char.characterName} (Level: ${char.level})`);
                            }
                            return isValid;
                        });
                        
                        if (filteredCharacters.length > 0) {
                            acc[server] = filteredCharacters;
                        }
                        return acc;
                    }, {} as { [key: string]: Character[] })
                },
                resources: response.resources
            };

            // 필터링 결과 확인
            console.log('Filtered expeditions:', filteredExpeditions);
            
            // 데이터 설정
            setData(filteredExpeditions);
            setResources(response.resources);

            // 1640 레벨 이상 캐릭터 확인 및 제외 상태 초기화
            const hasHighLevelCharacter = Object.values(filteredExpeditions.expeditions.expeditions).some(
                (characters: Character[]) => characters.some(char => char.level >= 1640)
            );

            if (hasHighLevelCharacter) {
                const newExcludeStates: CharacterExcludeState = {};
                Object.values(filteredExpeditions.expeditions.expeditions).forEach((characters: Character[]) => {
                    characters.forEach((character: Character) => {
                        newExcludeStates[character.characterName] = character.level < 1640;
                    });
                });
                setExcludeStates(newExcludeStates);
            }

            // 서버 정렬
            const sortedServers = Object.keys(filteredExpeditions.expeditions.expeditions).sort((a, b) => {
                const aGold = calculateServerTotalReward(
                    a,
                    filteredExpeditions.expeditions.expeditions[a],
                    selectedRaids,
                    goldRewardStates,
                    excludeStates,
                    customPriceMap,
                    chaosOption,
                    guardianOption
                ).totalTradableGold;
                const bGold = calculateServerTotalReward(
                    b,
                    filteredExpeditions.expeditions.expeditions[b],
                    selectedRaids,
                    goldRewardStates,
                    excludeStates,
                    customPriceMap,
                    chaosOption,
                    guardianOption
                ).totalTradableGold;
                return bGold - aGold;
            });
            setSortedServers(sortedServers);

            // 초기 시세 데이터 설정
            const initialPriceMap = response.resources.reduce((acc, resource) => {
                acc[resource.item] = resource.avgPrice;
                return acc;
            }, {} as Record<string, number>);
            setCustomPriceMap(initialPriceMap);

            // 각 서버별 상위 6개 캐릭터 초기화
            Object.entries(filteredExpeditions.expeditions.expeditions).forEach(([server, characters]) => {
                const topCharacters = [...characters]
                    .sort((a, b) => b.level - a.level)
                    .slice(0, 6);

                topCharacters.forEach((character: Character) => {
                    // 레이드 선택 초기화 (상위 3개 레이드)
                    initializeSelectedRaids(character);
                    // 골드 획득 옵션 활성화
                    setGoldRewardStates(prev => ({
                        ...prev,
                        [character.characterName]: true
                    }));
                });
            });
        } catch (error) {
            console.error('데이터 로딩 중 오류 발생:', error);
            setError('데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const fetchDataWithName = async (name: string) => {
        try {
            setLoading(true);
            setExcludedServers({});
            // 여기서 searchParams.get('name') 대신, 인자로 받은 name 값 사용
            const response = await searchCharacter(name);
            const filteredExpeditions: SearchResponse = {
                expeditions: {
                    expeditions: Object.entries(response.expeditions.expeditions).reduce((acc, [server, characters]) => {
                        const filteredCharacters = characters.filter((char: Character) => char.level >= 1370);
                        if (filteredCharacters.length > 0) {
                            acc[server] = filteredCharacters;
                        }
                        return acc;
                    }, {} as { [key: string]: Character[] })
                },
                resources: response.resources
            };

            setData(filteredExpeditions);
            setResources(response.resources);

            // 1640 레벨 이상 캐릭터 확인 및 제외 상태 초기화
            const hasHighLevelCharacter = Object.values(filteredExpeditions.expeditions.expeditions).some(
                (characters: Character[]) => characters.some(char => char.level >= 1640)
            );

            if (hasHighLevelCharacter) {
                const newExcludeStates: CharacterExcludeState = {};
                Object.values(filteredExpeditions.expeditions.expeditions).forEach((characters: Character[]) => {
                    characters.forEach((character: Character) => {
                        newExcludeStates[character.characterName] = character.level < 1640;
                    });
                });
                setExcludeStates(newExcludeStates);
            }

            // 서버 정렬 (골드 많은 순)
            const sortedServers = Object.keys(filteredExpeditions.expeditions.expeditions).sort((a, b) => {
                const aGold = calculateServerTotalReward(
                    a,
                    filteredExpeditions.expeditions.expeditions[a],
                    selectedRaids,
                    goldRewardStates,
                    excludeStates,
                    customPriceMap,
                    chaosOption,
                    guardianOption
                ).totalTradableGold;
                const bGold = calculateServerTotalReward(
                    b,
                    filteredExpeditions.expeditions.expeditions[b],
                    selectedRaids,
                    goldRewardStates,
                    excludeStates,
                    customPriceMap,
                    chaosOption,
                    guardianOption
                ).totalTradableGold;
                return bGold - aGold;
            });

            setSortedServers(sortedServers);

            // 초기 시세 데이터 설정
            const initialPriceMap = response.resources.reduce((acc, resource) => {
                acc[resource.item] = resource.avgPrice;
                return acc;
            }, {} as Record<string, number>);

            setCustomPriceMap(initialPriceMap);

            // 각 서버별로 레벨이 높은 상위 6개 캐릭터에 대해서만 초기화
            Object.entries(filteredExpeditions.expeditions.expeditions).forEach(([server, characters]) => {
                // 레벨 기준으로 정렬하고 상위 6개 선택
                const topCharacters = [...characters]
                    .sort((a, b) => b.level - a.level)
                    .slice(0, 6);

                // 선택된 캐릭터들에 대해서만 초기화
                topCharacters.forEach((character: Character) => {
                    // 레이드 선택 초기화
                    initializeSelectedRaids(character);
                    // 골드 획득 옵션 활성화
                    setGoldRewardStates(prev => ({
                        ...prev,
                        [character.characterName]: true
                    }));
                });
            });
        } catch (error) {
            console.error('데이터 로딩 중 오류 발생:', error);
            setError('데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, [searchParams]);

    // searchQueryChanged 이벤트 리스너 추가
    useEffect(() => {
        const handleSearchQueryChange = (event: CustomEvent) => {
            const {query} = event.detail;
            if (query) {
                // (2) 인자로 직접 query를 넘겨 주는 버전 호출
                fetchDataWithName(query);
            }
        };

        window.addEventListener('searchQueryChanged', handleSearchQueryChange as EventListener);
        return () => {
            window.removeEventListener('searchQueryChanged', handleSearchQueryChange as EventListener);
        };
    }, []);

    const handleHome = () => {
        navigate('/');
    };

    // 검색 핸들러 추가
    const handleSearch = (query: string) => {
        setLoading(true);
        setExcludedServers({}); // 서버 제외 상태 초기화
        navigate(`/result?name=${query}`);
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
                return {...prev, [characterName]: prevList.filter((n) => n !== raidName)};
            } else {
                return {...prev, [characterName]: [...prevList, raidName]};
            }
        });
    };

    const [expandedServers, setExpandedServers] = useState<Record<string, boolean>>({});
    const [expandedCharacters, setExpandedCharacters] = useState<Record<string, boolean>>({});

    // 데이터가 로드될 때 서버 토글 상태 초기화
    useEffect(() => {
        if (data?.expeditions?.expeditions) {
            const initial: Record<string, boolean> = {};
            Object.keys(data.expeditions.expeditions).forEach(server => {
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
        if (!data?.expeditions?.expeditions || !data.expeditions.expeditions[server]) return;

        const characters = data.expeditions.expeditions[server];
        const characterIndex = characters.findIndex((char: Character) => char.characterName === characterName);
        if (characterIndex === -1) return;

        if (isMobile) {
            // 모바일 화면에서는 클릭된 캐릭터만 토글
            setExpandedCharacters(prev => ({
                ...prev,
                [characterName]: !prev[characterName]
            }));
        } else {
            // 데스크톱 화면에서는 같은 행의 캐릭터도 함께 토글
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
        if (!data?.expeditions?.expeditions) return;
        const newSelectedRaids = {...selectedRaids};
        Object.values(data.expeditions.expeditions).forEach((characters: Character[]) => {
            characters.forEach((character: Character) => {
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
    const calculateServerTotalRewardForPage = React.useCallback((server: string) => {
        if (!data?.expeditions?.expeditions || !data.expeditions.expeditions[server]) {
            return { totalTradableGold: 0, totalBoundGold: 0 };
        }

        return calculateServerTotalReward(
            server,
            data.expeditions.expeditions[server],
            selectedRaids,
            goldRewardStates,
            excludeStates,
            customPriceMap,
            chaosOption,
            guardianOption
        );
    }, [data, selectedRaids, goldRewardStates, excludeStates, customPriceMap, chaosOption, guardianOption]);

    const calculateTotalRewardForPage = React.useCallback(() => {
        if (!data?.expeditions?.expeditions || !sortedServers) {
            return {
                totalTradableGold: 0,
                totalBoundGold: 0,
                tradableResourceRewards: {},
                boundResourceRewards: {}
            };
        }

        let totalTradableGold = 0;
        let totalBoundGold = 0;
        const tradableResourceRewards: Record<string, { count: number, goldValue: number }> = {};
        const boundResourceRewards: Record<string, { count: number, goldValue: number }> = {};

        // 모든 캐릭터 수집
        let allCharacters: Character[] = [];
        sortedServers.forEach(server => {
            if (excludedServers[server]) return;
            const characters = data.expeditions.expeditions[server] || [];
            if (!characters) return;
            allCharacters = [...allCharacters, ...characters];
        });

        // 각 캐릭터별로 보상 계산
        allCharacters.forEach((character: Character) => {
            if (!character || excludeStates[character.characterName]) return;

            // 카오스 던전 보상
            if (chaosOption !== 2) {
                const chaosReward = getSuitableChaosReward(character.level);
                if (chaosReward) {
                    const multiplier = chaosOption === 1 ? 14 / 3 : 7;
                    
                    // 순수 골드
                    if (chaosReward.gold) {
                        const goldAmount = chaosReward.gold * multiplier;
                        if (!tradableResourceRewards['GOLD']) {
                            tradableResourceRewards['GOLD'] = { count: 0, goldValue: 0 };
                        }
                        tradableResourceRewards['GOLD'].count += goldAmount;
                        tradableResourceRewards['GOLD'].goldValue += goldAmount;
                        totalTradableGold += goldAmount;
                    }

                    // 거래 가능 재화
                    if (chaosReward.weaponStones) {
                        Object.entries(chaosReward.weaponStones).forEach(([resource, count]) => {
                            const totalCount = count * multiplier;
                            if (!tradableResourceRewards[resource]) {
                                tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                            }
                            tradableResourceRewards[resource].count += totalCount;
                            const goldValue = totalCount * (customPriceMap[resource] || 0);
                            tradableResourceRewards[resource].goldValue += goldValue;
                            totalTradableGold += goldValue;
                        });
                    }
                    if (chaosReward.armorStones) {
                        Object.entries(chaosReward.armorStones).forEach(([resource, count]) => {
                            const totalCount = count * multiplier;
                            if (!tradableResourceRewards[resource]) {
                                tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                            }
                            tradableResourceRewards[resource].count += totalCount;
                            const goldValue = totalCount * (customPriceMap[resource] || 0);
                            tradableResourceRewards[resource].goldValue += goldValue;
                            totalTradableGold += goldValue;
                        });
                    }
                    if (chaosReward.gems) {
                        Object.entries(chaosReward.gems).forEach(([grade, count]) => {
                            const resource = `GEM_TIER_${grade}`;
                            const totalCount = count * multiplier;
                            if (!tradableResourceRewards[resource]) {
                                tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                            }
                            tradableResourceRewards[resource].count += totalCount;
                            const goldValue = totalCount * (customPriceMap[resource] || 0);
                            tradableResourceRewards[resource].goldValue += goldValue;
                            totalTradableGold += goldValue;
                        });
                    }

                    // 귀속 재화
                    if (chaosReward.shards) {
                        Object.entries(chaosReward.shards).forEach(([resource, count]) => {
                            const totalCount = count * multiplier;
                            if (!boundResourceRewards[resource]) {
                                boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                            }
                            boundResourceRewards[resource].count += totalCount;
                            const goldValue = totalCount * (customPriceMap[resource] || 0);
                            boundResourceRewards[resource].goldValue += goldValue;
                            totalBoundGold += goldValue;
                        });
                    }
                    if (chaosReward.leapStones) {
                        Object.entries(chaosReward.leapStones).forEach(([resource, count]) => {
                            const totalCount = count * multiplier;
                            if (!boundResourceRewards[resource]) {
                                boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                            }
                            boundResourceRewards[resource].count += totalCount;
                            const goldValue = totalCount * (customPriceMap[resource] || 0);
                            boundResourceRewards[resource].goldValue += goldValue;
                            totalBoundGold += goldValue;
                        });
                    }
                }
            }

            // 가디언 토벌 보상
            if (guardianOption !== 2) {
                const guardianReward = getSuitableGuardianReward(character.level);
                if (guardianReward) {
                    const multiplier = guardianOption === 1 ? 14 / 3 : 7;
                    
                    // 순수 골드
                    if (guardianReward.gold) {
                        const goldAmount = guardianReward.gold * multiplier;
                        if (!tradableResourceRewards['GOLD']) {
                            tradableResourceRewards['GOLD'] = { count: 0, goldValue: 0 };
                        }
                        tradableResourceRewards['GOLD'].count += goldAmount;
                        tradableResourceRewards['GOLD'].goldValue += goldAmount;
                        totalTradableGold += goldAmount;
                    }

                    // 거래 가능 재화
                    if (guardianReward.weaponStones) {
                        Object.entries(guardianReward.weaponStones).forEach(([resource, count]) => {
                            const totalCount = count * multiplier;
                            if (!tradableResourceRewards[resource]) {
                                tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                            }
                            tradableResourceRewards[resource].count += totalCount;
                            const goldValue = totalCount * (customPriceMap[resource] || 0);
                            tradableResourceRewards[resource].goldValue += goldValue;
                            totalTradableGold += goldValue;
                        });
                    }
                    if (guardianReward.armorStones) {
                        Object.entries(guardianReward.armorStones).forEach(([resource, count]) => {
                            const totalCount = count * multiplier;
                            if (!tradableResourceRewards[resource]) {
                                tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                            }
                            tradableResourceRewards[resource].count += totalCount;
                            const goldValue = totalCount * (customPriceMap[resource] || 0);
                            tradableResourceRewards[resource].goldValue += goldValue;
                            totalTradableGold += goldValue;
                        });
                    }
                    if (guardianReward.gems) {
                        Object.entries(guardianReward.gems).forEach(([grade, count]) => {
                            const resource = `GEM_TIER_${grade}`;
                            const totalCount = count * multiplier;
                            if (!tradableResourceRewards[resource]) {
                                tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                            }
                            tradableResourceRewards[resource].count += totalCount;
                            const goldValue = totalCount * (customPriceMap[resource] || 0);
                            tradableResourceRewards[resource].goldValue += goldValue;
                            totalTradableGold += goldValue;
                        });
                    }
                    if (guardianReward.leapStones) {
                        Object.entries(guardianReward.leapStones).forEach(([resource, count]) => {
                            const totalCount = count * multiplier;
                            if (!tradableResourceRewards[resource]) {
                                tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                            }
                            tradableResourceRewards[resource].count += totalCount;
                            const goldValue = totalCount * (customPriceMap[resource] || 0);
                            tradableResourceRewards[resource].goldValue += goldValue;
                            totalTradableGold += goldValue;
                        });
                    }

                    // 귀속 재화
                    if (guardianReward.shards) {
                        Object.entries(guardianReward.shards).forEach(([resource, count]) => {
                            const totalCount = count * multiplier;
                            if (!boundResourceRewards[resource]) {
                                boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                            }
                            boundResourceRewards[resource].count += totalCount;
                            const goldValue = totalCount * (customPriceMap[resource] || 0);
                            boundResourceRewards[resource].goldValue += goldValue;
                            totalBoundGold += goldValue;
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
                    const reward = isGoldReward ? raid.goldReward : raid.nonGoldReward;
                    
                    // 순수 골드
                    if (reward.gold) {
                        if (!tradableResourceRewards['GOLD']) {
                            tradableResourceRewards['GOLD'] = { count: 0, goldValue: 0 };
                        }
                        tradableResourceRewards['GOLD'].count += reward.gold;
                        tradableResourceRewards['GOLD'].goldValue += reward.gold;
                        totalTradableGold += reward.gold;
                    }

                    // 거래 가능 재화
                    if (reward.gems) {
                        Object.entries(reward.gems).forEach(([grade, count]) => {
                            const resource = `GEM_TIER_${grade}`;
                            if (!tradableResourceRewards[resource]) {
                                tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                            }
                            tradableResourceRewards[resource].count += count;
                            const goldValue = count * (customPriceMap[resource] || 0);
                            tradableResourceRewards[resource].goldValue += goldValue;
                            totalTradableGold += goldValue;
                        });
                    }

                    // 귀속 재화
                    if (reward.shards) {
                        Object.entries(reward.shards).forEach(([resource, count]) => {
                            if (!boundResourceRewards[resource]) {
                                boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                            }
                            boundResourceRewards[resource].count += count;
                            const goldValue = count * (customPriceMap[resource] || 0);
                            boundResourceRewards[resource].goldValue += goldValue;
                            totalBoundGold += goldValue;
                        });
                    }
                    if (reward.weaponStones) {
                        Object.entries(reward.weaponStones).forEach(([resource, count]) => {
                            if (!boundResourceRewards[resource]) {
                                boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                            }
                            boundResourceRewards[resource].count += count;
                            const goldValue = count * (customPriceMap[resource] || 0);
                            boundResourceRewards[resource].goldValue += goldValue;
                            totalBoundGold += goldValue;
                        });
                    }
                    if (reward.armorStones) {
                        Object.entries(reward.armorStones).forEach(([resource, count]) => {
                            if (!boundResourceRewards[resource]) {
                                boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                            }
                            boundResourceRewards[resource].count += count;
                            const goldValue = count * (customPriceMap[resource] || 0);
                            boundResourceRewards[resource].goldValue += goldValue;
                            totalBoundGold += goldValue;
                        });
                    }
                    if (reward.leapStones) {
                        Object.entries(reward.leapStones).forEach(([resource, count]) => {
                            if (!boundResourceRewards[resource]) {
                                boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                            }
                            boundResourceRewards[resource].count += count;
                            const goldValue = count * (customPriceMap[resource] || 0);
                            boundResourceRewards[resource].goldValue += goldValue;
                            totalBoundGold += goldValue;
                        });
                    }
                }
            });
        });

        return {
            totalTradableGold,
            totalBoundGold,
            tradableResourceRewards,
            boundResourceRewards
        };
    }, [data, sortedServers, excludedServers, excludeStates, selectedRaids, goldRewardStates, customPriceMap, chaosOption, guardianOption]);

    const calculateRaidReward = React.useCallback(() => {
        let totalTradableGold = 0;
        let totalBoundGold = 0;
        const tradableResourceRewards: Record<string, { count: number, goldValue: number }> = {};
        const boundResourceRewards: Record<string, { count: number, goldValue: number }> = {};

        if (!data?.expeditions?.expeditions || !sortedServers) {
            return {totalTradableGold, totalBoundGold, tradableResourceRewards, boundResourceRewards};
        }

        sortedServers.forEach(server => {
            if (excludedServers[server]) return;
            const characters = data.expeditions.expeditions[server] || [];
            if (!characters) return;

            characters.forEach((character: Character) => {
                if (!character || excludeStates[character.characterName]) return;
                const availableRaids = getAvailableRaids(character.level);
                const checkedRaids = selectedRaids[character.characterName] || [];
                const isGoldReward = goldRewardStates[character.characterName] || false;

                availableRaids.forEach(raid => {
                    if (checkedRaids.includes(raid.name)) {
                        const reward = isGoldReward ? raid.goldReward : raid.nonGoldReward;

                        // 순수 골드
                        if (reward.gold) {
                            if (!tradableResourceRewards['GOLD']) {
                                tradableResourceRewards['GOLD'] = { count: 0, goldValue: 0 };
                            }
                            tradableResourceRewards['GOLD'].count += reward.gold;
                            tradableResourceRewards['GOLD'].goldValue += reward.gold;
                            totalTradableGold += reward.gold;
                        }

                        // 거래 가능 재화
                        if (reward.gems) {
                            Object.entries(reward.gems).forEach(([grade, count]) => {
                                const resource = `GEM_TIER_${grade}`;
                                if (!tradableResourceRewards[resource]) {
                                    tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                                }
                                tradableResourceRewards[resource].count += count;
                                const goldValue = count * (customPriceMap[resource] || 0);
                                tradableResourceRewards[resource].goldValue += goldValue;
                                totalTradableGold += goldValue;
                            });
                        }

                        // 귀속 재화
                        if (reward.shards) {
                            Object.entries(reward.shards).forEach(([resource, count]) => {
                                if (!boundResourceRewards[resource]) {
                                    boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                                }
                                boundResourceRewards[resource].count += count;
                                const goldValue = count * (customPriceMap[resource] || 0);
                                boundResourceRewards[resource].goldValue += goldValue;
                                totalBoundGold += goldValue;
                            });
                        }
                        if (reward.weaponStones) {
                            Object.entries(reward.weaponStones).forEach(([resource, count]) => {
                                if (!boundResourceRewards[resource]) {
                                    boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                                }
                                boundResourceRewards[resource].count += count;
                                const goldValue = count * (customPriceMap[resource] || 0);
                                boundResourceRewards[resource].goldValue += goldValue;
                                totalBoundGold += goldValue;
                            });
                        }
                        if (reward.armorStones) {
                            Object.entries(reward.armorStones).forEach(([resource, count]) => {
                                if (!boundResourceRewards[resource]) {
                                    boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                                }
                                boundResourceRewards[resource].count += count;
                                const goldValue = count * (customPriceMap[resource] || 0);
                                boundResourceRewards[resource].goldValue += goldValue;
                                totalBoundGold += goldValue;
                            });
                        }
                        if (reward.leapStones) {
                            Object.entries(reward.leapStones).forEach(([resource, count]) => {
                                if (!boundResourceRewards[resource]) {
                                    boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                                }
                                boundResourceRewards[resource].count += count;
                                const goldValue = count * (customPriceMap[resource] || 0);
                                boundResourceRewards[resource].goldValue += goldValue;
                                totalBoundGold += goldValue;
                            });
                        }
                    }
                });
            });
        });

        return {totalTradableGold, totalBoundGold, tradableResourceRewards, boundResourceRewards};
    }, [data, sortedServers, excludedServers, excludeStates, selectedRaids, goldRewardStates, customPriceMap]);

    const calculateChaosReward = React.useCallback(() => {
        let totalTradableGold = 0;
        let totalBoundGold = 0;
        const tradableResourceRewards: Record<string, { count: number, goldValue: number }> = {};
        const boundResourceRewards: Record<string, { count: number, goldValue: number }> = {};

        if (!data?.expeditions?.expeditions || !sortedServers) {
            return {totalTradableGold, totalBoundGold, tradableResourceRewards, boundResourceRewards};
        }

        // multiplier 결정
        const chaosMultiplier = chaosOption === 1 ? 14 / 3 : chaosOption === 2 ? 0 : 7;

        sortedServers.forEach(server => {
            if (excludedServers[server]) return;
            const characters = data.expeditions.expeditions[server] || [];
            if (!characters) return;

            characters.forEach((character: Character) => {
                if (!character || excludeStates[character.characterName]) return;
                if (chaosOption !== 2) {
                    const chaosReward = getSuitableChaosReward(character.level);
                    if (chaosReward) {
                        // 순수 골드
                        if (chaosReward.gold) {
                            const goldAmount = chaosReward.gold * chaosMultiplier;
                            if (!tradableResourceRewards['GOLD']) {
                                tradableResourceRewards['GOLD'] = { count: 0, goldValue: 0 };
                            }
                            tradableResourceRewards['GOLD'].count += goldAmount;
                            tradableResourceRewards['GOLD'].goldValue += goldAmount;
                            totalTradableGold += goldAmount;
                        }

                        // 거래 가능 재화
                        if (chaosReward.weaponStones) {
                            Object.entries(chaosReward.weaponStones).forEach(([resource, count]) => {
                                const totalCount = count * chaosMultiplier;
                                if (!tradableResourceRewards[resource]) {
                                    tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                                }
                                tradableResourceRewards[resource].count += totalCount;
                                const goldValue = totalCount * (customPriceMap[resource] || 0);
                                tradableResourceRewards[resource].goldValue += goldValue;
                                totalTradableGold += goldValue;
                            });
                        }
                        if (chaosReward.armorStones) {
                            Object.entries(chaosReward.armorStones).forEach(([resource, count]) => {
                                const totalCount = count * chaosMultiplier;
                                if (!tradableResourceRewards[resource]) {
                                    tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                                }
                                tradableResourceRewards[resource].count += totalCount;
                                const goldValue = totalCount * (customPriceMap[resource] || 0);
                                tradableResourceRewards[resource].goldValue += goldValue;
                                totalTradableGold += goldValue;
                            });
                        }
                        if (chaosReward.gems) {
                            Object.entries(chaosReward.gems).forEach(([grade, count]) => {
                                const resource = `GEM_TIER_${grade}`;
                                const totalCount = count * chaosMultiplier;
                                if (!tradableResourceRewards[resource]) {
                                    tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                                }
                                tradableResourceRewards[resource].count += totalCount;
                                const goldValue = totalCount * (customPriceMap[resource] || 0);
                                tradableResourceRewards[resource].goldValue += goldValue;
                                totalTradableGold += goldValue;
                            });
                        }

                        // 귀속 재화
                        if (chaosReward.shards) {
                            Object.entries(chaosReward.shards).forEach(([resource, count]) => {
                                const totalCount = count * chaosMultiplier;
                                if (!boundResourceRewards[resource]) {
                                    boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                                }
                                boundResourceRewards[resource].count += totalCount;
                                const goldValue = totalCount * (customPriceMap[resource] || 0);
                                boundResourceRewards[resource].goldValue += goldValue;
                                totalBoundGold += goldValue;
                            });
                        }
                        if (chaosReward.leapStones) {
                            Object.entries(chaosReward.leapStones).forEach(([resource, count]) => {
                                const totalCount = count * chaosMultiplier;
                                if (!boundResourceRewards[resource]) {
                                    boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                                }
                                boundResourceRewards[resource].count += totalCount;
                                const goldValue = totalCount * (customPriceMap[resource] || 0);
                                boundResourceRewards[resource].goldValue += goldValue;
                                totalBoundGold += goldValue;
                            });
                        }
                    }
                }
            });
        });

        return {totalTradableGold, totalBoundGold, tradableResourceRewards, boundResourceRewards};
    }, [data, sortedServers, excludedServers, excludeStates, chaosOption, customPriceMap]);

    const calculateGuardianReward = React.useCallback(() => {
        let totalTradableGold = 0;
        let totalBoundGold = 0;
        const tradableResourceRewards: Record<string, { count: number, goldValue: number }> = {};
        const boundResourceRewards: Record<string, { count: number, goldValue: number }> = {};

        if (!data?.expeditions?.expeditions || !sortedServers) {
            return {totalTradableGold, totalBoundGold, tradableResourceRewards, boundResourceRewards};
        }

        // multiplier 결정
        const guardianMultiplier = guardianOption === 1 ? 14 / 3 : guardianOption === 2 ? 0 : 7;

        sortedServers.forEach(server => {
            if (excludedServers[server]) return;
            const characters = data.expeditions.expeditions[server] || [];
            if (!characters) return;

            characters.forEach((character: Character) => {
                if (!character || excludeStates[character.characterName]) return;
                if (guardianOption !== 2) {
                    const guardianReward = getSuitableGuardianReward(character.level);
                    if (guardianReward) {
                        // 순수 골드
                        if (guardianReward.gold) {
                            const goldAmount = guardianReward.gold * guardianMultiplier;
                            if (!tradableResourceRewards['GOLD']) {
                                tradableResourceRewards['GOLD'] = { count: 0, goldValue: 0 };
                            }
                            tradableResourceRewards['GOLD'].count += goldAmount;
                            tradableResourceRewards['GOLD'].goldValue += goldAmount;
                            totalTradableGold += goldAmount;
                        }

                        // 거래 가능 재화
                        if (guardianReward.weaponStones) {
                            Object.entries(guardianReward.weaponStones).forEach(([resource, count]) => {
                                const totalCount = count * guardianMultiplier;
                                if (!tradableResourceRewards[resource]) {
                                    tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                                }
                                tradableResourceRewards[resource].count += totalCount;
                                const goldValue = totalCount * (customPriceMap[resource] || 0);
                                tradableResourceRewards[resource].goldValue += goldValue;
                                totalTradableGold += goldValue;
                            });
                        }
                        if (guardianReward.armorStones) {
                            Object.entries(guardianReward.armorStones).forEach(([resource, count]) => {
                                const totalCount = count * guardianMultiplier;
                                if (!tradableResourceRewards[resource]) {
                                    tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                                }
                                tradableResourceRewards[resource].count += totalCount;
                                const goldValue = totalCount * (customPriceMap[resource] || 0);
                                tradableResourceRewards[resource].goldValue += goldValue;
                                totalTradableGold += goldValue;
                            });
                        }
                        if (guardianReward.gems) {
                            Object.entries(guardianReward.gems).forEach(([grade, count]) => {
                                const resource = `GEM_TIER_${grade}`;
                                const totalCount = count * guardianMultiplier;
                                if (!tradableResourceRewards[resource]) {
                                    tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                                }
                                tradableResourceRewards[resource].count += totalCount;
                                const goldValue = totalCount * (customPriceMap[resource] || 0);
                                tradableResourceRewards[resource].goldValue += goldValue;
                                totalTradableGold += goldValue;
                            });
                        }

                        // 귀속 재화
                        if (guardianReward.leapStones) {
                            Object.entries(guardianReward.leapStones).forEach(([resource, count]) => {
                                const totalCount = count * guardianMultiplier;
                                if (!tradableResourceRewards[resource]) {
                                    tradableResourceRewards[resource] = { count: 0, goldValue: 0 };
                                }
                                tradableResourceRewards[resource].count += totalCount;
                                const goldValue = totalCount * (customPriceMap[resource] || 0);
                                tradableResourceRewards[resource].goldValue += goldValue;
                                totalTradableGold += goldValue;
                            });
                        }
                        if (guardianReward.shards) {
                            Object.entries(guardianReward.shards).forEach(([resource, count]) => {
                                const totalCount = count * guardianMultiplier;
                                if (!boundResourceRewards[resource]) {
                                    boundResourceRewards[resource] = { count: 0, goldValue: 0 };
                                }
                                boundResourceRewards[resource].count += totalCount;
                                const goldValue = totalCount * (customPriceMap[resource] || 0);
                                boundResourceRewards[resource].goldValue += goldValue;
                                totalBoundGold += goldValue;
                            });
                        }
                    }
                }
            });
        });

        return {totalTradableGold, totalBoundGold, tradableResourceRewards, boundResourceRewards};
    }, [data, sortedServers, excludedServers, excludeStates, guardianOption, customPriceMap]);

    // 일괄 제외 핸들러
    const handleBatchExcludeByLevel = (level: number) => {
        if (!data?.expeditions?.expeditions) return;
        const newExclude = {...excludeStates};
        Object.values(data.expeditions.expeditions).forEach((characters: Character[]) => {
            characters.forEach((character: Character) => {
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
        setCustomPriceMap(prev => ({...prev, [item]: value}));
    };

    // 초기 레이드 선택 상태 설정
    const initializeSelectedRaids = React.useCallback((character: Character) => {
        const availableRaids = getAvailableRaids(character.level);
        const topThreeRaids = availableRaids.slice(0, 3).map(raid => raid.name);
        setSelectedRaids(prev => ({
            ...prev,
            [character.characterName]: topThreeRaids
        }));
    }, []);

    const handleServerExcludeChange = (server: string) => {
        setExcludedServers(prev => ({
            ...prev,
            [server]: !prev[server]
        }));

        // 서버가 제외되면 해당 서버 카드를 접고, 제외 해제되면 펼침
        setExpandedServers(prev => ({
            ...prev,
            [server]: excludedServers[server]
        }));
    };

    const handleRefresh = async () => {
        // 갱신 시 모든 상태 초기화
        setData(null);
        setSelectedRaids({});
        setGoldRewardStates({});
        setExcludeStates({});
        setSortedServers([]);
        setExcludedServers({});
        setCustomPriceMap({});
        setResources([]);
        
        try {
            setLoading(true);
            const response = await renewExpeditionCharacters(searchParams.get('name') || '');
            
            // 필터링된 데이터 생성
            const filteredExpeditions = {
                expeditions: {
                    expeditions: Object.entries(response.expeditions.expeditions).reduce((acc, [server, characters]) => {
                        // 레벨 1370 이상 캐릭터만 필터링
                        const filteredCharacters = characters.filter((char: Character) => {
                            const isValid = char.level >= 1370;
                            if (!isValid) {
                                console.log(`Filtered out character: ${char.characterName} (Level: ${char.level})`);
                            }
                            return isValid;
                        });
                        
                        if (filteredCharacters.length > 0) {
                            acc[server] = filteredCharacters;
                        }
                        return acc;
                    }, {} as { [key: string]: Character[] })
                },
                resources: response.resources
            };

            // 필터링 결과 확인
            console.log('Filtered expeditions:', filteredExpeditions);
            
            // 데이터 설정
            setData(filteredExpeditions);
            setResources(response.resources);

            // 초기 시세 데이터 설정 (추가된 부분)
            const initialPriceMap = response.resources.reduce((acc, resource) => {
                acc[resource.item] = resource.avgPrice;
                return acc;
            }, {} as Record<string, number>);
            setCustomPriceMap(initialPriceMap);

            // 1640 레벨 이상 캐릭터 확인 및 제외 상태 초기화
            const hasHighLevelCharacter = Object.values(filteredExpeditions.expeditions.expeditions).some(
                (characters: Character[]) => characters.some(char => char.level >= 1640)
            );

            if (hasHighLevelCharacter) {
                const newExcludeStates: CharacterExcludeState = {};
                Object.values(filteredExpeditions.expeditions.expeditions).forEach((characters: Character[]) => {
                    characters.forEach((character: Character) => {
                        newExcludeStates[character.characterName] = character.level < 1640;
                    });
                });
                setExcludeStates(newExcludeStates);
            }

            // 서버 정렬
            const sortedServers = Object.keys(filteredExpeditions.expeditions.expeditions).sort((a, b) => {
                const aGold = calculateServerTotalReward(
                    a,
                    filteredExpeditions.expeditions.expeditions[a],
                    selectedRaids,
                    goldRewardStates,
                    excludeStates,
                    customPriceMap,
                    chaosOption,
                    guardianOption
                ).totalTradableGold;
                const bGold = calculateServerTotalReward(
                    b,
                    filteredExpeditions.expeditions.expeditions[b],
                    selectedRaids,
                    goldRewardStates,
                    excludeStates,
                    customPriceMap,
                    chaosOption,
                    guardianOption
                ).totalTradableGold;
                return bGold - aGold;
            });
            setSortedServers(sortedServers);

            // 각 서버별 상위 6개 캐릭터 초기화
            Object.entries(filteredExpeditions.expeditions.expeditions).forEach(([server, characters]) => {
                const topCharacters = [...characters]
                    .sort((a, b) => b.level - a.level)
                    .slice(0, 6);

                topCharacters.forEach((character: Character) => {
                    // 레이드 선택 초기화 (상위 3개 레이드)
                    initializeSelectedRaids(character);
                    // 골드 획득 옵션 활성화
                    setGoldRewardStates(prev => ({
                        ...prev,
                        [character.characterName]: true
                    }));
                });
            });
        } catch (error) {
            console.error('데이터 갱신 중 오류 발생:', error);
            setError('데이터를 갱신하는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <GlobalStyles
                styles={{
                    '*::-webkit-scrollbar': {
                        display: 'none'
                    },
                    '*': {
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none'
                    }
                }}
            />
            <Container maxWidth={false} sx={{ 
                pt: isMobile ? '180px' : '120px', 
                pb: 4,
                maxWidth: '850px !important',
                overflow: 'auto'
            }}>
                <SearchResultHeader
                    searchQuery={searchParams.get('name') || ''}
                    setSearchQuery={(query) => {
                        const params = new URLSearchParams(searchParams);
                        params.set('name', query);
                        navigate(`/result?${params.toString()}`);
                    }}
                    totalTradableGold={data ? calculateTotalRewardForPage().totalTradableGold : 0}
                    totalBoundGold={data ? calculateTotalRewardForPage().totalBoundGold : 0}
                    tab={tab}
                    setTab={setTab}
                    onHome={handleHome}
                    onRefresh={handleRefresh}
                />
                {loading ? (
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: 'calc(100vh - 120px)',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        <img 
                            src="/images/mokoko/cheer_mokoko.png"
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
                ) : error ? (
                    <Typography color="error" align="center">{error}</Typography>
                ) : data ? (
                    <>
                        {tab === 0 && (
                            <Box sx={{ mt: 2 }}>
                                {sortedServers.map((server) => (
                                    <ServerCard
                                        key={server}
                                        server={server}
                                        characters={data.expeditions.expeditions[server]}
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
                                        calculateServerTotalReward={calculateServerTotalRewardForPage}
                                        isServerExcluded={excludedServers[server] || false}
                                        onServerExcludeChange={handleServerExcludeChange}
                                    />
                                ))}
                            </Box>
                        )}
                        {tab === 1 && (
                            <Box sx={{ mt: 2 }}>
                                <TotalRewardCard
                                    calculateTotalReward={calculateTotalRewardForPage}
                                    calculateRaidReward={calculateRaidReward}
                                    calculateChaosReward={calculateChaosReward}
                                    calculateGuardianReward={calculateGuardianReward}
                                    resources={resources}
                                />
                            </Box>
                        )}
                        {tab === 2 && (
                            <OptionTab
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
                            <Box sx={{ mt: 2 }}>
                                <PriceTab
                                    resources={resources}
                                    priceMap={customPriceMap}
                                    onPriceChange={handlePriceChange}
                                    onClose={() => {}}
                                />
                            </Box>
                        )}
                    </>
                ) : null}
            </Container>
        </>
    );
};

export default SearchResultPage;
