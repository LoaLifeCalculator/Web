import React, {useState, useEffect, useMemo} from 'react';
import {Box, Container, Typography, Card} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useTheme, useMediaQuery} from '@mui/material';
import {api, Resource} from '../services/api';
import LevelRewardHeader from '../components/LevelRewardHeader';
import OptionCard from '../components/OptionCard';
import RewardCard from '../components/RewardCard';
import PriceTab from '../components/PriceTab';
import {
    getAvailableRaids,
    getSuitableChaosReward,
    getSuitableGuardianReward,
} from '../utils/rewardCalculator';
import {GlobalStyles} from '@mui/material';
import ComparisonCard from '../components/ComparisonCard';
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

    const [mainLevel, setMainLevel] = useState<string>('');
    const [compareLevel, setCompareLevel] = useState<string>('');
    const [calculatedMainLevel, setCalculatedMainLevel] = useState<number | null>(null);
    const [calculatedCompareLevel, setCalculatedCompareLevel] = useState<number | null>(null);

    const [guardianOption, setGuardianOption] = useState<'daily' | 'rest' | 'none'>('daily');
    const [chaosOption, setChaosOption] = useState<'daily' | 'rest' | 'none'>('daily');
    const [selectedRaids, setSelectedRaids] = useState<string[]>([]);
    const [calculatedRaids, setCalculatedRaids] = useState<string[]>([]);
    const [selectedCompareRaids, setSelectedCompareRaids] = useState<string[]>([]);

    const [resources, setResources] = useState<Resource[]>([]);
    const [priceMap, setPriceMap] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTab, setCurrentTab] = useState(0);
    const [retryCount, setRetryCount] = useState(0);
    const [hasCalculated, setHasCalculated] = useState(false);

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

    const handleMainLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        if (v === '' || /^\d+$/.test(v)) {
            setMainLevel(v);
            // 레벨이 변경될 때마다 해당 레벨에 맞는 레이드 선택 상태 초기화
            if (v !== '') {
                const level = parseInt(v);
                if (!isNaN(level)) {
                    setSelectedRaids(getAvailableRaids(level).slice(0, 3).map(r => r.name));
                }
            } else {
                setSelectedRaids([]);
            }
        }
    };
    const handleCompareLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        if (v === '' || /^\d+$/.test(v)) {
            setCompareLevel(v);
            // 비교 레벨이 변경될 때 해당 레벨의 상위 3개 레이드를 기본 선택
            if (v !== '') {
                const level = parseInt(v);
                if (!isNaN(level)) {
                    setSelectedCompareRaids(getAvailableRaids(level).slice(0, 3).map(r => r.name));
                }
            } else {
                setSelectedCompareRaids([]);
            }
        }
    };
    const handleCalculate = () => {
        if (mainLevel) {
            const level = parseInt(mainLevel);
            if (!isNaN(level)) {
                setCalculatedMainLevel(level);
                setCalculatedRaids(selectedRaids);
            }
        }
        if (compareLevel) {
            const level = parseInt(compareLevel);
            if (!isNaN(level)) {
                setCalculatedCompareLevel(level);
            }
        }
        // 계산이 완료되면 결과 탭으로 이동
        setCurrentTab(1);
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleCalculate();
    };
    const handleRaidToggle = (name: string) => {
        setSelectedRaids(prev => {
            const newRaids = prev.includes(name)
                ? prev.filter(r => r !== name)
                : [...prev, name];
            return newRaids;
        });
        // 레이드 선택이 변경되어도 계산 결과는 유지
        // setCalculatedMainLevel(null);
        // setCalculatedCompareLevel(null);
    };
    const handleCompareRaidToggle = (name: string) => {
        setSelectedCompareRaids(prev =>
            prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
        );
    };
    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };
    const handlePriceChange = (item: string, val: number) => {
        setPriceMap(prev => ({...prev, [item]: val}));
    };

    // Convert resource count to gold value
    const calculateGoldValue = (resource: string, count: number): number => {
        return (priceMap[resource] ?? 0) * count;
    };

    // Detailed reward calculation (original logic preserved)
    const calculateLevelReward = (level: number, isCompare: boolean = false): LevelReward => {
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
        const targetRaidNames = isCompare ? selectedCompareRaids : calculatedRaids;
        const targetRaids = availableRaids.filter(raid => targetRaidNames.includes(raid.name));

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

    const mainReward = calculatedMainLevel !== null
        ? calculateLevelReward(calculatedMainLevel)
        : null;
    const compareReward = calculatedCompareLevel !== null
        ? calculateLevelReward(calculatedCompareLevel, true)
        : null;

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
                <LevelRewardHeader currentTab={currentTab} onTabChange={handleTabChange}/>
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
                                mainLevel={mainLevel}
                                compareLevel={compareLevel}
                                onMainLevelChange={handleMainLevelChange}
                                onCompareLevelChange={handleCompareLevelChange}
                                onCalculate={handleCalculate}
                                onKeyDown={handleKeyDown}
                                guardianOption={guardianOption}
                                isMobile={isMobile}
                                onGuardianOptionChange={setGuardianOption}
                                chaosOption={chaosOption}
                                onChaosOptionChange={setChaosOption}
                                selectedRaids={selectedRaids}
                                onRaidToggle={handleRaidToggle}
                                calculatedMainLevel={calculatedMainLevel}
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
                            {calculatedCompareLevel !== null && compareReward && (compareReward.totalTradableGold > 0 || compareReward.totalBoundGold > 0) && (
                                <ComparisonCard
                                    mainReward={mainReward}
                                    compareReward={compareReward}
                                    compareLevel={calculatedCompareLevel}
                                    selectedCompareRaids={selectedCompareRaids}
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
                                {calculatedMainLevel !== null && mainReward && (
                                    <>
                                        {mainReward.totalTradableGold === 0 && mainReward.totalBoundGold === 0 ? (
                                            <Box sx={{textAlign: 'center', py: 4, color: 'text.secondary'}}>
                                                표시할 보상이 없습니다
                                            </Box>
                                        ) : (
                                            <>
                                                <RewardCard
                                                    title="총 보상"
                                                    imageUrl="images/mokoko/total_mokoko.png"
                                                    tradableGold={mainReward.totalTradableGold}
                                                    boundGold={mainReward.totalBoundGold}
                                                    tradableRewards={mainReward.tradableResourceRewards}
                                                    boundRewards={mainReward.boundResourceRewards}
                                                />
                                                {mainReward.raidTradableGold > 0 || mainReward.raidBoundGold > 0 ? (
                                                    <RewardCard
                                                        title="레이드 보상"
                                                        imageUrl="images/mokoko/raid_mokoko.png"
                                                        tradableGold={mainReward.raidTradableGold}
                                                        boundGold={mainReward.raidBoundGold}
                                                        tradableRewards={mainReward.raidTradableRewards}
                                                        boundRewards={mainReward.raidBoundRewards}
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
                            <PriceTab
                                resources={resources.map(r => ({item: r.item, avgPrice: r.avgPrice}))}
                                priceMap={priceMap}
                                onPriceChange={handlePriceChange}
                                onClose={() => setCurrentTab(0)}
                            />
                        </Box>
                    )}
                    {loading ? (
                        <Box sx={{mt: 5}}>
                            <Typography>로딩 중...</Typography>
                        </Box>
                    ) : error ? (
                        <Box sx={{mt: 5}}>
                            <Typography color="error">{error}</Typography>
                        </Box>
                    ) : null}
                </Container>
            </Box>
        </>
    );
};

export default LevelRewardPage;
