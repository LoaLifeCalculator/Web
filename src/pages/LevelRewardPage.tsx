import React, {useState, useEffect, useMemo} from 'react';
import {Box, Container, Typography, Card} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useTheme, useMediaQuery} from '@mui/material';
import {api, Resource} from '../services/api';
import LevelRewardHeader from '../components/levelRewardPage/LevelRewardHeader';
import OptionCard from '../components/levelRewardPage/OptionCard';
import RewardCard from '../components/levelRewardPage/RewardCard';
import PriceTab from '../components/common/PriceTab';
import {
    getAvailableRaids,
    getSuitableChaosReward,
    getSuitableGuardianReward,
} from '../utils/rewardCalculator';
import {GlobalStyles} from '@mui/material';
import ComparisonCard from '../components/levelRewardPage/ComparisonCard';
import {useHead} from "../hooks/useHead";

interface LevelReward {
    totalTradableGold: number;
    totalBoundGold: number;
    tradableResourceRewards: Record<string, { count: number; goldValue: number }>;
    boundResourceRewards: Record<string, { count: number; goldValue: number }>;
    chaosTradableGold: number;
    chaosBoundGold: number;
    guardianTradableGold: number;
    guardianBoundGold: number;
    raidTradableGold: number;
    raidBoundGold: number;
    chaosTradableRewards: Record<string, { count: number; goldValue: number }>;
    chaosBoundRewards: Record<string, { count: number; goldValue: number }>;
    guardianTradableRewards: Record<string, { count: number; goldValue: number }>;
    guardianBoundRewards: Record<string, { count: number; goldValue: number }>;
    raidTradableRewards: Record<string, { count: number; goldValue: number }>;
    raidBoundRewards: Record<string, { count: number; goldValue: number }>;
}

const LevelRewardPage: React.FC = () => {
    const headConfig = useMemo(() => ({
        title: '레벨로 계산 | 로생계산기',
        canonical: 'https://www.loalife.co.kr/level-reward',
        metas: [
            {name: 'description', content: '레벨별 주간 주급량을 확인해보세요.'},
            {name: 'robots', content: 'noindex,follow'},
        ],
        scripts: [
            {
                innerHTML: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "url": "https://www.loalife.co.kr/level-reward",
                    "name": "레벨로 계산 | 로생계산기",
                    "description": "레벨별 주간 주급량을 확인해보세요."
                })
            }
        ],
    }), [])
    useHead(headConfig);

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width:800px)');

    const [currentInput, setCurrentInput] = useState<{
        mainLevel: string;
        compareLevel: string;
        guardianOption: 'daily' | 'rest' | 'none';
        chaosOption: 'daily' | 'rest' | 'none';
        selectedRaids: string[];
        selectedCompareRaids: string[];
    }>({
        mainLevel: '',
        compareLevel: '',
        guardianOption: 'daily',
        chaosOption: 'daily',
        selectedRaids: [],
        selectedCompareRaids: []
    });

    const [fixedMainReward, setFixedMainReward] = useState<LevelReward | null>(null);
    const [fixedCompareReward, setFixedCompareReward] = useState<LevelReward | null>(null);
    const [fixedOptions, setFixedOptions] = useState<{
        guardianOption: 'daily' | 'rest' | 'none';
        chaosOption: 'daily' | 'rest' | 'none';
    } | null>(null);
    const [fixedCompareLevel, setFixedCompareLevel] = useState<number | null>(null);

    const [resources, setResources] = useState<Resource[]>([]);
    const [priceMap, setPriceMap] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTab, setCurrentTab] = useState(0);
    const [retryCount, setRetryCount] = useState(0);
    const [hasCalculated, setHasCalculated] = useState(false);
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const [isPriceSettingOpen, setIsPriceSettingOpen] = useState(false);

    // Fetch resource prices
    useEffect(() => {
        const fetchResources = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await api.getResourcePrices();
                setResources(res);
                const map: Record<string, number> = {};
                res.forEach(r => {
                    map[r.item] = r.avgPrice;
                });
                setPriceMap(map);
            } catch (e) {
                setError(e instanceof Error ? e.message : '리소스 가격을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, [retryCount]);

    const handleCalculate = () => {
        if (currentInput.mainLevel) {
            const mainLevel = parseInt(currentInput.mainLevel);
            if (!isNaN(mainLevel)) {
                const mainReward = calculateLevelReward(
                    mainLevel,
                    false,
                    currentInput.selectedRaids,
                    { guardianOption: currentInput.guardianOption, chaosOption: currentInput.chaosOption }
                );
                setFixedMainReward(mainReward);
                setFixedOptions({
                    guardianOption: currentInput.guardianOption,
                    chaosOption: currentInput.chaosOption
                });

                // 비교 캐릭터의 레벨이 비어있으면 0으로 취급
                const compareLevel = currentInput.compareLevel ? parseInt(currentInput.compareLevel) : 0;
                if (!isNaN(compareLevel)) {
                    // 비교 캐릭터의 레벨에 맞는 상위 3개 레이드를 선택
                    const availableRaids = getAvailableRaids(compareLevel).slice(0, 3).map(r => r.name);
                    setCurrentInput(prev => ({
                        ...prev,
                        selectedCompareRaids: availableRaids
                    }));

                    const compareReward = calculateLevelReward(
                        compareLevel,
                        true,
                        availableRaids,
                        { guardianOption: currentInput.guardianOption, chaosOption: currentInput.chaosOption }
                    );
                    setFixedCompareReward(compareReward);
                    setFixedCompareLevel(compareLevel);
                }

                setCurrentTab(1);
            }
        }
    };

    const handleGuardianOptionChange = (option: 'daily' | 'rest' | 'none') => {
        // 상태 업데이트
        setCurrentInput(prev => ({
            ...prev,
            guardianOption: option
        }));
        
        // 옵션이 변경되면 비교 캐릭터의 계산값도 즉시 업데이트
        if (fixedCompareLevel && fixedOptions) {
            const newCompareReward = calculateLevelReward(
                fixedCompareLevel,
                true,
                currentInput.selectedCompareRaids,
                { guardianOption: fixedOptions.guardianOption, chaosOption: fixedOptions.chaosOption }
            );
            setFixedCompareReward(newCompareReward);
        }
    };

    const handleChaosOptionChange = (option: 'daily' | 'rest' | 'none') => {
        // 상태 업데이트
        setCurrentInput(prev => ({
            ...prev,
            chaosOption: option
        }));
        
        // 옵션이 변경되면 비교 캐릭터의 계산값도 즉시 업데이트
        if (fixedCompareLevel && fixedOptions) {
            const newCompareReward = calculateLevelReward(
                fixedCompareLevel,
                true,
                currentInput.selectedCompareRaids,
                { guardianOption: fixedOptions.guardianOption, chaosOption: fixedOptions.chaosOption }
            );
            setFixedCompareReward(newCompareReward);
        }
    };

    const handleRaidToggle = (name: string) => {
        setCurrentInput(prev => ({
            ...prev,
            selectedRaids: prev.selectedRaids.includes(name)
                ? prev.selectedRaids.filter(r => r !== name)
                : [...prev.selectedRaids, name]
        }));
    };

    const handleCompareRaidToggle = (raidName: string) => {
        setCurrentInput(prev => {
            const newSelectedCompareRaids = prev.selectedCompareRaids.includes(raidName)
                ? prev.selectedCompareRaids.filter(name => name !== raidName)
                : [...prev.selectedCompareRaids, raidName];

            // 레이드 선택이 변경되면 비교 캐릭터의 계산값도 즉시 업데이트
            if (fixedCompareLevel && fixedOptions) {
                // 새로운 레이드 선택 상태를 직접 전달하여 계산
                const newCompareReward = calculateLevelReward(
                    fixedCompareLevel,
                    true,
                    newSelectedCompareRaids,
                    { guardianOption: fixedOptions.guardianOption, chaosOption: fixedOptions.chaosOption }
                );
                setFixedCompareReward(newCompareReward);
            }

            return {
                ...prev,
                selectedCompareRaids: newSelectedCompareRaids
            };
        });
    };

    const handleMainLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        if (v === '' || /^\d+$/.test(v)) {
            setCurrentInput(prev => ({
                ...prev,
                mainLevel: v
            }));
            // 레벨이 변경될 때마다 해당 레벨에 맞는 레이드 선택 상태 초기화
            if (v !== '') {
                const level = parseInt(v);
                if (!isNaN(level)) {
                    setCurrentInput(prev => ({
                        ...prev,
                        selectedRaids: getAvailableRaids(level).slice(0, 3).map(r => r.name)
                    }));
                }
            } else {
                setCurrentInput(prev => ({
                    ...prev,
                    selectedRaids: []
                }));
            }
        }
    };

    const handleCompareLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        if (v === '' || /^\d+$/.test(v)) {
            setCurrentInput(prev => ({
                ...prev,
                compareLevel: v
            }));
        }
    };

    const calculateLevelReward = (
        level: number, 
        isCompare: boolean = false, 
        selectedRaidsOverride?: string[], 
        optionsOverride?: { guardianOption: 'daily' | 'rest' | 'none', chaosOption: 'daily' | 'rest' | 'none' }
    ): LevelReward => {
        // 옵션 오버라이드가 있으면 그것을 사용하고, 없으면 현재 입력값을 사용
        const guardianOption = optionsOverride?.guardianOption ?? currentInput.guardianOption;
        const chaosOption = optionsOverride?.chaosOption ?? currentInput.chaosOption;
        // selectedRaidsOverride가 있으면 그것을 사용하고, 없으면 currentInput에서 가져옴
        const selectedRaids = selectedRaidsOverride ?? (isCompare ? currentInput.selectedCompareRaids : currentInput.selectedRaids);

        let totalTradableGold = 0;
        let totalBoundGold = 0;
        const tradableResourceRewards: Record<string, { count: number; goldValue: number }> = {};
        const boundResourceRewards: Record<string, { count: number; goldValue: number }> = {};
        const chaosTradableRewards: Record<string, { count: number; goldValue: number }> = {};
        const chaosBoundRewards: Record<string, { count: number; goldValue: number }> = {};
        const guardianTradableRewards: Record<string, { count: number; goldValue: number }> = {};
        const guardianBoundRewards: Record<string, { count: number; goldValue: number }> = {};
        const raidTradableRewards: Record<string, { count: number; goldValue: number }> = {};
        const raidBoundRewards: Record<string, { count: number; goldValue: number }> = {};

        let chaosTradableGold = 0;
        let chaosBoundGold = 0;
        let guardianTradableGold = 0;
        let guardianBoundGold = 0;
        let raidTradableGold = 0;
        let raidBoundGold = 0;

        // Chaos Dungeon
        if (chaosOption !== 'none') {
            const r = getSuitableChaosReward(level);
            if (r) {
                const mult = chaosOption === 'daily' ? 7 : 14 / 3;
                if (r.gold) {
                    const amt = r.gold * mult;
                    tradableResourceRewards['GOLD'] = tradableResourceRewards['GOLD'] ?? {count: 0, goldValue: 0};
                    chaosTradableRewards['GOLD'] = chaosTradableRewards['GOLD'] ?? {count: 0, goldValue: 0};
                    tradableResourceRewards['GOLD'].count += amt;
                    tradableResourceRewards['GOLD'].goldValue += amt;
                    chaosTradableRewards['GOLD'].count += amt;
                    chaosTradableRewards['GOLD'].goldValue += amt;
                    totalTradableGold += amt;
                    chaosTradableGold += amt;
                }
                if (r.weaponStones) {
                    Object.entries(r.weaponStones).forEach(([item, cnt]) => {
                        const c = cnt * mult;
                        tradableResourceRewards[item] = tradableResourceRewards[item] ?? {count: 0, goldValue: 0};
                        chaosTradableRewards[item] = chaosTradableRewards[item] ?? {count: 0, goldValue: 0};
                        tradableResourceRewards[item].count += c;
                        const gv = calculateGoldValue(item, c);
                        tradableResourceRewards[item].goldValue += gv;
                        chaosTradableRewards[item].count += c;
                        chaosTradableRewards[item].goldValue += gv;
                        totalTradableGold += gv;
                        chaosTradableGold += gv;
                    });
                }
                if (r.armorStones) {
                    Object.entries(r.armorStones).forEach(([item, cnt]) => {
                        const c = cnt * mult;
                        tradableResourceRewards[item] = tradableResourceRewards[item] ?? {count: 0, goldValue: 0};
                        chaosTradableRewards[item] = chaosTradableRewards[item] ?? {count: 0, goldValue: 0};
                        tradableResourceRewards[item].count += c;
                        const gv = calculateGoldValue(item, c);
                        tradableResourceRewards[item].goldValue += gv;
                        chaosTradableRewards[item].count += c;
                        chaosTradableRewards[item].goldValue += gv;
                        totalTradableGold += gv;
                        chaosTradableGold += gv;
                    });
                }
                if (r.gems) {
                    Object.entries(r.gems).forEach(([tier, cnt]) => {
                        const key = `GEM_TIER_${tier}`;
                        const c = cnt * mult;
                        tradableResourceRewards[key] = tradableResourceRewards[key] ?? {count: 0, goldValue: 0};
                        chaosTradableRewards[key] = chaosTradableRewards[key] ?? {count: 0, goldValue: 0};
                        tradableResourceRewards[key].count += c;
                        const gv = calculateGoldValue(key, c);
                        tradableResourceRewards[key].goldValue += gv;
                        chaosTradableRewards[key].count += c;
                        chaosTradableRewards[key].goldValue += gv;
                        totalTradableGold += gv;
                        chaosTradableGold += gv;
                    });
                }
                if (r.shards) {
                    Object.entries(r.shards).forEach(([item, cnt]) => {
                        const c = cnt * mult;
                        boundResourceRewards[item] = boundResourceRewards[item] ?? {count: 0, goldValue: 0};
                        chaosBoundRewards[item] = chaosBoundRewards[item] ?? {count: 0, goldValue: 0};
                        boundResourceRewards[item].count += c;
                        const gv = calculateGoldValue(item, c);
                        boundResourceRewards[item].goldValue += gv;
                        chaosBoundRewards[item].count += c;
                        chaosBoundRewards[item].goldValue += gv;
                        totalBoundGold += gv;
                        chaosBoundGold += gv;
                    });
                }
                if (r.leapStones) {
                    Object.entries(r.leapStones).forEach(([item, cnt]) => {
                        const c = cnt * mult;
                        boundResourceRewards[item] = boundResourceRewards[item] ?? {count: 0, goldValue: 0};
                        chaosBoundRewards[item] = chaosBoundRewards[item] ?? {count: 0, goldValue: 0};
                        boundResourceRewards[item].count += c;
                        const gv = calculateGoldValue(item, c);
                        boundResourceRewards[item].goldValue += gv;
                        chaosBoundRewards[item].count += c;
                        chaosBoundRewards[item].goldValue += gv;
                        totalBoundGold += gv;
                        chaosBoundGold += gv;
                    });
                }
            }
        }

        // Guardian Raid
        if (guardianOption !== 'none') {
            const r = getSuitableGuardianReward(level);
            if (r) {
                const mult = guardianOption === 'daily' ? 7 : 14 / 3;
                if (r.gold) {
                    const amt = r.gold * mult;
                    tradableResourceRewards['GOLD'] = tradableResourceRewards['GOLD'] ?? {count: 0, goldValue: 0};
                    guardianTradableRewards['GOLD'] = guardianTradableRewards['GOLD'] ?? {count: 0, goldValue: 0};
                    tradableResourceRewards['GOLD'].count += amt;
                    tradableResourceRewards['GOLD'].goldValue += amt;
                    guardianTradableRewards['GOLD'].count += amt;
                    guardianTradableRewards['GOLD'].goldValue += amt;
                    totalTradableGold += amt;
                    guardianTradableGold += amt;
                }
                if (r.leapStones) {
                    Object.entries(r.leapStones).forEach(([item, cnt]) => {
                        const c = cnt * mult;
                        tradableResourceRewards[item] = tradableResourceRewards[item] ?? {count: 0, goldValue: 0};
                        guardianTradableRewards[item] = guardianTradableRewards[item] ?? {count: 0, goldValue: 0};
                        tradableResourceRewards[item].count += c;
                        const gv = calculateGoldValue(item, c);
                        tradableResourceRewards[item].goldValue += gv;
                        guardianTradableRewards[item].count += c;
                        guardianTradableRewards[item].goldValue += gv;
                        totalTradableGold += gv;
                        guardianTradableGold += gv;
                    });
                }
                if (r.weaponStones) {
                    Object.entries(r.weaponStones).forEach(([item, cnt]) => {
                        const c = cnt * mult;
                        tradableResourceRewards[item] = tradableResourceRewards[item] ?? {count: 0, goldValue: 0};
                        guardianTradableRewards[item] = guardianTradableRewards[item] ?? {count: 0, goldValue: 0};
                        tradableResourceRewards[item].count += c;
                        const gv = calculateGoldValue(item, c);
                        tradableResourceRewards[item].goldValue += gv;
                        guardianTradableRewards[item].count += c;
                        guardianTradableRewards[item].goldValue += gv;
                        totalTradableGold += gv;
                        guardianTradableGold += gv;
                    });
                }
                if (r.armorStones) {
                    Object.entries(r.armorStones).forEach(([item, cnt]) => {
                        const c = cnt * mult;
                        tradableResourceRewards[item] = tradableResourceRewards[item] ?? {count: 0, goldValue: 0};
                        guardianTradableRewards[item] = guardianTradableRewards[item] ?? {count: 0, goldValue: 0};
                        tradableResourceRewards[item].count += c;
                        const gv = calculateGoldValue(item, c);
                        tradableResourceRewards[item].goldValue += gv;
                        guardianTradableRewards[item].count += c;
                        guardianTradableRewards[item].goldValue += gv;
                        totalTradableGold += gv;
                        guardianTradableGold += gv;
                    });
                }
                if (r.gems) {
                    Object.entries(r.gems).forEach(([tier, cnt]) => {
                        const key = `GEM_TIER_${tier}`;
                        const c = cnt * mult;
                        tradableResourceRewards[key] = tradableResourceRewards[key] ?? {count: 0, goldValue: 0};
                        guardianTradableRewards[key] = guardianTradableRewards[key] ?? {count: 0, goldValue: 0};
                        tradableResourceRewards[key].count += c;
                        const gv = calculateGoldValue(key, c);
                        tradableResourceRewards[key].goldValue += gv;
                        guardianTradableRewards[key].count += c;
                        guardianTradableRewards[key].goldValue += gv;
                        totalTradableGold += gv;
                        guardianTradableGold += gv;
                    });
                }
                if (r.shards) {
                    Object.entries(r.shards).forEach(([item, cnt]) => {
                        const c = cnt * mult;
                        boundResourceRewards[item] = boundResourceRewards[item] ?? {count: 0, goldValue: 0};
                        guardianBoundRewards[item] = guardianBoundRewards[item] ?? {count: 0, goldValue: 0};
                        boundResourceRewards[item].count += c;
                        const gv = calculateGoldValue(item, c);
                        boundResourceRewards[item].goldValue += gv;
                        guardianBoundRewards[item].count += c;
                        guardianBoundRewards[item].goldValue += gv;
                        totalBoundGold += gv;
                        guardianBoundGold += gv;
                    });
                }
            }
        }

        // Raid Rewards
        const availableRaids = getAvailableRaids(level);
        const targetRaids = availableRaids.filter(raid => selectedRaids.includes(raid.name));

        targetRaids.forEach(raid => {
            if (raid.goldReward.gold) {
                const g = raid.goldReward.gold;
                tradableResourceRewards['GOLD'] = tradableResourceRewards['GOLD'] ?? {count: 0, goldValue: 0};
                raidTradableRewards['GOLD'] = raidTradableRewards['GOLD'] ?? {count: 0, goldValue: 0};
                tradableResourceRewards['GOLD'].count += g;
                tradableResourceRewards['GOLD'].goldValue += g;
                raidTradableRewards['GOLD'].count += g;
                raidTradableRewards['GOLD'].goldValue += g;
                totalTradableGold += g;
                raidTradableGold += g;
            }
            if (raid.goldReward.gems) {
                Object.entries(raid.goldReward.gems).forEach(([tier, cnt]) => {
                    const key = `GEM_TIER_${tier}`;
                    tradableResourceRewards[key] = tradableResourceRewards[key] ?? {count: 0, goldValue: 0};
                    raidTradableRewards[key] = raidTradableRewards[key] ?? {count: 0, goldValue: 0};
                    tradableResourceRewards[key].count += cnt;
                    const gv = calculateGoldValue(key, cnt);
                    tradableResourceRewards[key].goldValue += gv;
                    raidTradableRewards[key].count += cnt;
                    raidTradableRewards[key].goldValue += gv;
                    totalTradableGold += gv;
                    raidTradableGold += gv;
                });
            }
            if (raid.goldReward.shards) {
                Object.entries(raid.goldReward.shards).forEach(([item, cnt]) => {
                    boundResourceRewards[item] = boundResourceRewards[item] ?? {count: 0, goldValue: 0};
                    raidBoundRewards[item] = raidBoundRewards[item] ?? {count: 0, goldValue: 0};
                    boundResourceRewards[item].count += cnt;
                    const gv = calculateGoldValue(item, cnt);
                    boundResourceRewards[item].goldValue += gv;
                    raidBoundRewards[item].count += cnt;
                    raidBoundRewards[item].goldValue += gv;
                    totalBoundGold += gv;
                    raidBoundGold += gv;
                });
            }
            if (raid.goldReward.weaponStones) {
                Object.entries(raid.goldReward.weaponStones).forEach(([item, cnt]) => {
                    boundResourceRewards[item] = boundResourceRewards[item] ?? {count: 0, goldValue: 0};
                    raidBoundRewards[item] = raidBoundRewards[item] ?? {count: 0, goldValue: 0};
                    boundResourceRewards[item].count += cnt;
                    const gv = calculateGoldValue(item, cnt);
                    boundResourceRewards[item].goldValue += gv;
                    raidBoundRewards[item].count += cnt;
                    raidBoundRewards[item].goldValue += gv;
                    totalBoundGold += gv;
                    raidBoundGold += gv;
                });
            }
            if (raid.goldReward.armorStones) {
                Object.entries(raid.goldReward.armorStones).forEach(([item, cnt]) => {
                    boundResourceRewards[item] = boundResourceRewards[item] ?? {count: 0, goldValue: 0};
                    raidBoundRewards[item] = raidBoundRewards[item] ?? {count: 0, goldValue: 0};
                    boundResourceRewards[item].count += cnt;
                    const gv = calculateGoldValue(item, cnt);
                    boundResourceRewards[item].goldValue += gv;
                    raidBoundRewards[item].count += cnt;
                    raidBoundRewards[item].goldValue += gv;
                    totalBoundGold += gv;
                    raidBoundGold += gv;
                });
            }
        });

        return {
            totalTradableGold,
            totalBoundGold,
            tradableResourceRewards,
            boundResourceRewards,
            chaosTradableGold,
            chaosBoundGold,
            guardianTradableGold,
            guardianBoundGold,
            raidTradableGold,
            raidBoundGold,
            chaosTradableRewards,
            chaosBoundRewards,
            guardianTradableRewards,
            guardianBoundRewards,
            raidTradableRewards,
            raidBoundRewards,
        };
    };

    // Convert resource count to gold value
    const calculateGoldValue = (resource: string, count: number): number => {
        return (priceMap[resource] ?? 0) * count;
    };

    // 기준 캐릭터의 계산값은 고정된 값을 사용하고, 비교 캐릭터의 계산값도 고정된 값을 사용
    const mainReward = fixedMainReward;
    const compareReward = fixedCompareReward;

    const toggleCard = (cardId: string) => {
        if (isMobile) {
            // 모바일 화면에서는 클릭된 카드만 토글
            setExpandedCards(prev => ({
                ...prev,
                [cardId]: !prev[cardId]
            }));
        } else {
            // PC 화면에서는 같은 행의 카드도 함께 토글
            const [cardType, cardIndex] = cardId.split('-');
            const isCurrentlyExpanded = expandedCards[cardId];

            // mainReward가 null이면 해당 카드만 토글
            if (!mainReward) {
                setExpandedCards(prev => ({
                    ...prev,
                    [cardId]: !prev[cardId]
                }));
                return;
            }

            // 현재 렌더링된 카드들의 순서를 결정
            const renderedCards = [];
            if (mainReward.totalTradableGold > 0 || mainReward.totalBoundGold > 0) {
                renderedCards.push({ type: 'total', id: 'total-0' });
            }
            if (mainReward.raidTradableGold > 0 || mainReward.raidBoundGold > 0) {
                renderedCards.push({ type: 'raid', id: 'raid-1' });
            }
            if (mainReward.chaosTradableGold > 0 || mainReward.chaosBoundGold > 0) {
                renderedCards.push({ type: 'chaos', id: 'chaos-2' });
            }
            if (mainReward.guardianTradableGold > 0 || mainReward.guardianBoundGold > 0) {
                renderedCards.push({ type: 'guardian', id: 'guardian-3' });
            }

            // 현재 카드의 인덱스 찾기
            const currentIndex = renderedCards.findIndex(card => card.id === cardId);
            if (currentIndex !== -1) {
                const isEvenIndex = currentIndex % 2 === 0;
                const pairIndex = isEvenIndex ? currentIndex + 1 : currentIndex - 1;

                // 같은 행의 카드가 있는 경우에만 토글
                if (pairIndex >= 0 && pairIndex < renderedCards.length) {
                    const pairCard = renderedCards[pairIndex];
                    setExpandedCards(prev => ({
                        ...prev,
                        [cardId]: !isCurrentlyExpanded,
                        [pairCard.id]: !isCurrentlyExpanded
                    }));
                } else {
                    // 짝이 없는 경우 해당 카드만 토글
                    setExpandedCards(prev => ({
                        ...prev,
                        [cardId]: !prev[cardId]
                    }));
                }
            }
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
            <Box sx={{minHeight: '100vh', bgcolor: 'background.default'}}>
                <LevelRewardHeader currentTab={currentTab} onTabChange={(_, newValue) => setCurrentTab(newValue)}/>
                <Container maxWidth={false} sx={{py: 12, maxWidth: '850px !important', height: 'auto'}}>
                    {currentTab === 0 && (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            width: '100%',
                            maxWidth: '1200px',
                            mx: 'auto',
                            px: 2,
                            mt: 5
                        }}>
                            <OptionCard
                                mainLevel={currentInput.mainLevel}
                                compareLevel={currentInput.compareLevel}
                                onMainLevelChange={handleMainLevelChange}
                                onCompareLevelChange={handleCompareLevelChange}
                                onCalculate={handleCalculate}
                                onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
                                guardianOption={currentInput.guardianOption}
                                isMobile={isMobile}
                                onGuardianOptionChange={handleGuardianOptionChange}
                                chaosOption={currentInput.chaosOption}
                                onChaosOptionChange={handleChaosOptionChange}
                                selectedRaids={currentInput.selectedRaids}
                                onRaidToggle={handleRaidToggle}
                                calculatedMainLevel={fixedMainReward ? parseInt(currentInput.mainLevel) : null}
                            />
                        </Box>
                    )}
                    {currentTab === 1 && (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            width: '100%',
                            maxWidth: '1200px',
                            mx: 'auto',
                            px: 2,
                            mt: 5
                        }}>
                            {compareReward && (compareReward.totalTradableGold > 0 || compareReward.totalBoundGold > 0) && (
                                <ComparisonCard
                                    mainReward={mainReward}
                                    compareReward={compareReward}
                                    compareLevel={fixedCompareLevel}
                                    selectedCompareRaids={currentInput.selectedCompareRaids}
                                    onCompareRaidToggle={handleCompareRaidToggle}
                                    isMobile={isMobile}
                                />
                            )}
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                                gap: 2,
                                width: '100%'
                            }}>
                                {mainReward && (
                                    <>
                                        {mainReward.totalTradableGold === 0 && mainReward.totalBoundGold === 0 ? (
                                            <Box sx={{
                                                gridColumn: '1 / -1',
                                                textAlign: 'center',
                                                py: 4,
                                                color: 'text.secondary'
                                            }}>
                                                표시할 보상이 없습니다. 레벨 값을 확인해주세요.
                                            </Box>
                                        ) : (
                                            <>
                                                {mainReward.totalTradableGold > 0 || mainReward.totalBoundGold > 0 ? (
                                                    <RewardCard
                                                        title="총 보상"
                                                        imageUrl="images/mokoko/total_mokoko.png"
                                                        tradableGold={mainReward.totalTradableGold}
                                                        boundGold={mainReward.totalBoundGold}
                                                        tradableRewards={mainReward.tradableResourceRewards}
                                                        boundRewards={mainReward.boundResourceRewards}
                                                        isExpanded={expandedCards['total-0']}
                                                        onToggle={() => toggleCard('total-0')}
                                                    />
                                                ) : null}
                                                {mainReward.raidTradableGold > 0 || mainReward.raidBoundGold > 0 ? (
                                                    <RewardCard
                                                        title="레이드 보상"
                                                        imageUrl="images/mokoko/raid_mokoko.png"
                                                        tradableGold={mainReward.raidTradableGold}
                                                        boundGold={mainReward.raidBoundGold}
                                                        tradableRewards={mainReward.raidTradableRewards}
                                                        boundRewards={mainReward.raidBoundRewards}
                                                        isExpanded={expandedCards['raid-1']}
                                                        onToggle={() => toggleCard('raid-1')}
                                                    />
                                                ) : null}
                                                {mainReward.chaosTradableGold > 0 || mainReward.chaosBoundGold > 0 ? (
                                                    <RewardCard
                                                        title="카오스 던전 보상"
                                                        imageUrl="images/mokoko/chaos_mokoko.png"
                                                        tradableGold={mainReward.chaosTradableGold}
                                                        boundGold={mainReward.chaosBoundGold}
                                                        tradableRewards={mainReward.chaosTradableRewards}
                                                        boundRewards={mainReward.chaosBoundRewards}
                                                        isExpanded={expandedCards['chaos-2']}
                                                        onToggle={() => toggleCard('chaos-2')}
                                                    />
                                                ) : null}
                                                {mainReward.guardianTradableGold > 0 || mainReward.guardianBoundGold > 0 ? (
                                                    <RewardCard
                                                        title="가디언 토벌 보상"
                                                        imageUrl="images/mokoko/guardian_mokoko.png"
                                                        tradableGold={mainReward.guardianTradableGold}
                                                        boundGold={mainReward.guardianBoundGold}
                                                        tradableRewards={mainReward.guardianTradableRewards}
                                                        boundRewards={mainReward.guardianBoundRewards}
                                                        isExpanded={expandedCards['guardian-3']}
                                                        onToggle={() => toggleCard('guardian-3')}
                                                    />
                                                ) : null}
                                            </>
                                        )}
                                    </>
                                )}
                            </Box>
                        </Box>
                    )}
                    {currentTab === 2 && (
                        <Box sx={{mt: 5}}>
                            <Typography 
                                variant="body1" 
                                color="text.secondary" 
                                align="center" 
                            >
                                시세 변경은 계산하기 버튼을 눌렀을 때 반영됩니다
                            </Typography>
                            <PriceTab
                                resources={resources.map(r => ({item: r.item, avgPrice: r.avgPrice}))}
                                priceMap={priceMap}
                                onPriceChange={(item: string, val: number) => setPriceMap(prev => ({...prev, [item]: val}))}
                                onClose={() => setCurrentTab(0)}
                            />
                        </Box>
                    )}
                </Container>
            </Box>
        </>
    );
};

export default LevelRewardPage;
