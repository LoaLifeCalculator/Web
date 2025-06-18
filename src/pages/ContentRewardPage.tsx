import React, {useState, useEffect, useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Card,
    CardContent,
    Divider,
    Avatar,
    CircularProgress,
    Collapse,
    Button,
    GlobalStyles,
    useMediaQuery
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import {raidRewards} from '../utils/raidTable';
import {chaosDungeonRewards, guardianRewards} from '../utils/rewardTables';
import {Reward} from '../utils/rewardCalculator';
import {ITEM_TRANSLATIONS} from '../types';
import {api} from '../services/api';
import {useHead} from "../hooks/useHead";
import RewardCard from '../components/contentRewardPage/RewardCard';
import RestViewButton from '../components/contentRewardPage/RestViewButton';

interface Resource {
    item: string;
    avgPrice: number;
    id: number;
    name: string;
    image: string;
}

interface ResourceResponse {
    data: Resource[];
}

const ContentRewardPage: React.FC = () => {
    const navigate = useNavigate();
    const [showPriceEditor, setShowPriceEditor] = useState(false);
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
    const [isChaosRestView, setIsChaosRestView] = useState(false);
    const [isGuardianRestView, setIsGuardianRestView] = useState(false);
    const isMobile = useMediaQuery('(max-width:800px)');

    const headConfig = useMemo(() => ({
        title: '컨텐츠 보상 | 로생계산기',
        canonical: 'https://www.loalife.co.kr/content-reward',
        metas: [
            {name: 'description', content: '컨텐츠별 보상을 확인해보세요.'},
            {name: 'robots', content: 'noindex,follow'},
        ],
        scripts: [
            {
                innerHTML: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "url": "https://www.loalife.co.kr/content-reward",
                    "name": "컨텐츠 보상 | 로생계산기",
                    "description": "컨텐츠별 보상을 확인해보세요."
                })
            }
        ],
    }), []);
    useHead(headConfig)

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await api.getResourcePrices();
                setResources(response);
                setLoading(false);
            } catch (error) {
                console.error('시세 데이터 로딩 중 오류 발생:', error);
                setError('시세 데이터를 불러오는데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    const handleHome = () => {
        navigate('/');
    };

    const togglePriceEditor = () => {
        setShowPriceEditor(!showPriceEditor);
    };

    const toggleCard = (cardId: string) => {
        if (isMobile) {
            // 모바일 화면에서는 클릭된 카드만 토글
            setExpandedCards(prev => ({
                ...prev,
                [cardId]: !prev[cardId]
            }));
        } else {
            // PC 화면에서는 같은 행의 카드도 함께 토글
            const cardIndex = parseInt(cardId.split('-')[1]);
            const isEvenIndex = cardIndex % 2 === 0;
            const pairIndex = isEvenIndex ? cardIndex + 1 : cardIndex - 1;
            const cardType = cardId.split('-')[0]; // 'raid', 'chaos', 'guardian'

            // 같은 행의 카드가 있는 경우에만 토글
            if (pairIndex >= 0) {
                const pairCardId = `${cardType}-${pairIndex}`;
                const isCurrentlyExpanded = expandedCards[cardId];

                setExpandedCards(prev => ({
                    ...prev,
                    [cardId]: !isCurrentlyExpanded,
                    [pairCardId]: !isCurrentlyExpanded
                }));
            } else {
                // 짝이 없는 경우 해당 카드만 토글
                setExpandedCards(prev => ({
                    ...prev,
                    [cardId]: !prev[cardId]
                }));
            }
        }
    };

    const calculateGoldValue = (reward: Reward): number => {
        let total = 0;

        if (reward.gold) {
            total += reward.gold;
        }

        if (reward.shards) {
            Object.entries(reward.shards).forEach(([key, count]) => {
                const resource = resources.find(r => r.item === key);
                if (resource) {
                    total += count * resource.avgPrice;
                }
            });
        }

        if (reward.leapStones) {
            Object.entries(reward.leapStones).forEach(([key, count]) => {
                const resource = resources.find(r => r.item === key);
                if (resource) {
                    total += count * resource.avgPrice;
                }
            });
        }

        if (reward.weaponStones) {
            Object.entries(reward.weaponStones).forEach(([key, count]) => {
                const resource = resources.find(r => r.item === key);
                if (resource) {
                    total += count * resource.avgPrice;
                }
            });
        }

        if (reward.armorStones) {
            Object.entries(reward.armorStones).forEach(([key, count]) => {
                const resource = resources.find(r => r.item === key);
                if (resource) {
                    total += count * resource.avgPrice;
                }
            });
        }

        if (reward.gems) {
            Object.entries(reward.gems).forEach(([key, count]) => {
                const gemKey = `GEM_TIER_${key}`;
                const resource = resources.find(r => r.item === gemKey);
                if (resource) {
                    total += count * resource.avgPrice;
                }
            });
        }

        return total;
    };

    const calculateRestReward = (reward: Reward, isRestView: boolean): Reward => {
        if (!isRestView) return reward;
        
        return {
            ...reward,
            gold: reward.gold ? reward.gold * 2 : undefined,
            shards: reward.shards ? Object.entries(reward.shards).reduce((acc, [key, value]) => ({
                ...acc,
                [key]: value * 2
            }), {}) : undefined,
            leapStones: reward.leapStones ? Object.entries(reward.leapStones).reduce((acc, [key, value]) => ({
                ...acc,
                [key]: value * 2
            }), {}) : undefined,
            weaponStones: reward.weaponStones ? Object.entries(reward.weaponStones).reduce((acc, [key, value]) => ({
                ...acc,
                [key]: value * 2
            }), {}) : undefined,
            armorStones: reward.armorStones ? Object.entries(reward.armorStones).reduce((acc, [key, value]) => ({
                ...acc,
                [key]: value * 2
            }), {}) : undefined,
            gems: reward.gems ? Object.entries(reward.gems).reduce((acc, [key, value]) => ({
                ...acc,
                [key]: value * 2
            }), {}) : undefined
        };
    };

    const calculateRestGoldValue = (reward: Reward, isRestView: boolean): number => {
        return calculateGoldValue(calculateRestReward(reward, isRestView));
    };

    const formatRestReward = (reward: Reward, isRestView: boolean) => {
        const restReward = calculateRestReward(reward, isRestView);
        return formatReward(restReward);
    };

    const formatReward = (reward: Reward): { name: string; count: number; image: string; goldValue?: number }[] => {
        const details: { name: string; count: number; image: string; goldValue?: number }[] = [];

        if (reward.gold) {
            details.push({
                name: '골드',
                count: reward.gold,
                image: '/images/items/GOLD.png',
                goldValue: reward.gold
            });
        }

        if (reward.shards) {
            Object.entries(reward.shards).forEach(([key, value]) => {
                const resource = resources.find(r => r.item === key);
                details.push({
                    name: ITEM_TRANSLATIONS[key] || key,
                    count: value,
                    image: `/images/items/${key}.png`,
                    goldValue: resource ? value * resource.avgPrice : undefined
                });
            });
        }

        if (reward.leapStones) {
            Object.entries(reward.leapStones).forEach(([key, value]) => {
                const resource = resources.find(r => r.item === key);
                details.push({
                    name: ITEM_TRANSLATIONS[key] || key,
                    count: value,
                    image: `/images/items/${key}.png`,
                    goldValue: resource ? value * resource.avgPrice : undefined
                });
            });
        }

        if (reward.weaponStones) {
            Object.entries(reward.weaponStones).forEach(([key, value]) => {
                const resource = resources.find(r => r.item === key);
                details.push({
                    name: ITEM_TRANSLATIONS[key] || key,
                    count: value,
                    image: `/images/items/${key}.png`,
                    goldValue: resource ? value * resource.avgPrice : undefined
                });
            });
        }

        if (reward.armorStones) {
            Object.entries(reward.armorStones).forEach(([key, value]) => {
                const resource = resources.find(r => r.item === key);
                details.push({
                    name: ITEM_TRANSLATIONS[key] || key,
                    count: value,
                    image: `/images/items/${key}.png`,
                    goldValue: resource ? value * resource.avgPrice : undefined
                });
            });
        }

        if (reward.gems) {
            Object.entries(reward.gems).forEach(([key, value]) => {
                const gemKey = `GEM_TIER_${key}`;
                const resource = resources.find(r => r.item === gemKey);
                details.push({
                    name: ITEM_TRANSLATIONS[gemKey] || `${key}티어 보석`,
                    count: value,
                    image: `/images/items/${gemKey}.png`,
                    goldValue: resource ? value * resource.avgPrice : undefined
                });
            });
        }

        return details;
    };

    return (
        <Box sx={{minHeight: '100vh', backgroundColor: 'background.default'}}>
            <GlobalStyles
                styles={{
                    '*': {
                        '&::-webkit-scrollbar': {
                            display: 'none'
                        },
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }
                }}
            />
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 1200,
                backgroundColor: 'background.paper',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                py: 2,
                px: {xs: 2, sm: 4},
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    maxWidth: '1200px',
                    mx: 'auto',
                }}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <Box sx={{height: {xs: 36, sm: 48}}}>
                            <img
                                src="/images/mokoko/flex_mokoko.png"
                                alt="컨텐츠 보상 보기"
                                style={{
                                    height: '100%',
                                    width: 'auto',
                                }}
                            />
                        </Box>
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 'bold',
                                fontSize: { xs: '1.25rem', sm: '2rem' },
                            }}
                        >
                            컨텐츠 보상 보기
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            flexShrink: 0,
                            cursor: 'pointer',
                            '&:hover': { opacity: 0.8 },
                        }}
                        onClick={handleHome}
                    >
                        <Box sx={{height: {xs: 36, sm: 48}}}>
                            <img
                                src="/images/mokoko/title_mokoko.png"
                                alt="로생계산기"
                                style={{
                                    height: '100%',
                                    width: 'auto'
                                }}
                            />
                        </Box>
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 'bold',
                                fontSize: { xs: '1.25rem', sm: '2rem' },
                            }}
                        >
                            로생계산기
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Container maxWidth={false} sx={{
                py: 2,
                px: isMobile ? 0 : 2,
                maxWidth: '850px !important'
            }}>
                {loading ? (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '200px'
                    }}>
                        <CircularProgress/>
                    </Box>
                ) : error ? (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '200px'
                    }}>
                        <Typography color="error" align="center">{error}</Typography>
                    </Box>
                ) : (
                    <Box sx={{pt: '84px', overflow: 'auto'}}>
                        <Box sx={{maxWidth: '1200px', mx: 'auto', width: '100%'}}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    mb: 2,
                                    textAlign: 'left',
                                    fontStyle: 'italic',
                                    px: 2
                                }}
                            >
                                가디언 토벌과 카오스 던전 보상은 추정치이며, 지속적으로 업데이트중입니다.
                            </Typography>
                            <Box sx={{p: 2}}>
                                <Accordion
                                    sx={{
                                        mb: 2,
                                        '&:before': {
                                            display: 'none',
                                        },
                                        '&:hover:not(:has(.MuiCard-root:hover))': {
                                            '& .MuiAccordionSummary-root': {
                                                backgroundColor: '#F6FFF0',
                                                transition: 'background-color 0.2s ease-in-out'
                                            },
                                            '& .MuiAccordionDetails-root': {
                                                backgroundColor: '#F6FFF0',
                                                transition: 'background-color 0.2s ease-in-out'
                                            }
                                        }
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandLessIcon/>}
                                        sx={{
                                            backgroundColor: 'background.paper',
                                        }}
                                    >
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                            <Box
                                                component="img"
                                                src="/images/mokoko/raid_mokoko.png"
                                                alt="레이드 보상"
                                                sx={{
                                                    width: '50px',
                                                    height: 'auto',
                                                    objectFit: 'contain'
                                                }}
                                            />
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    color: 'primary.main',
                                                    fontWeight: 'bold',
                                                    fontSize: '1.5rem'
                                                }}
                                            >
                                                레이드 보상
                                            </Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{p: 0}}>
                                        <Box sx={{
                                            display: 'grid',
                                            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                                            gap: isMobile ? 1.5 : 2,
                                            p: 2
                                        }}>
                                            {raidRewards.map((raid, index) => {
                                                const cardId = `raid-${index}`;
                                                const isExpanded = expandedCards[cardId];
                                                return (
                                                    <RewardCard
                                                        key={index}
                                                        title={raid.name}
                                                        goldValue={calculateGoldValue(raid.goldReward)}
                                                        reward={raid.goldReward}
                                                        nonGoldReward={raid.nonGoldReward}
                                                        isExpanded={isExpanded}
                                                        onToggle={() => toggleCard(cardId)}
                                                        formatReward={formatReward}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion
                                    sx={{
                                        mb: 2,
                                        '&:before': {
                                            display: 'none',
                                        },
                                        '&:hover:not(:has(.MuiCard-root:hover))': {
                                            '& .MuiAccordionSummary-root': {
                                                backgroundColor: '#F6FFF0',
                                                transition: 'background-color 0.2s ease-in-out'
                                            },
                                            '& .MuiAccordionDetails-root': {
                                                backgroundColor: '#F6FFF0',
                                                transition: 'background-color 0.2s ease-in-out'
                                            }
                                        }
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandLessIcon/>}
                                        sx={{
                                            backgroundColor: 'background.paper',
                                        }}
                                    >
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, width: '100%', justifyContent: 'space-between'}}>
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                <Box
                                                    component="img"
                                                    src="/images/mokoko/chaos_mokoko.png"
                                                    alt="카오스 던전 보상"
                                                    sx={{
                                                        width: '50px',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                                <Typography
                                                    variant="h5"
                                                    sx={{
                                                        color: 'primary.main',
                                                        fontWeight: 'bold',
                                                        fontSize: '1.5rem'
                                                    }}
                                                >
                                                    카오스 던전 보상
                                                </Typography>
                                            </Box>
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                <RestViewButton
                                                    isActive={isChaosRestView}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsChaosRestView(!isChaosRestView);
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{p: 0}}>
                                        <Box sx={{
                                            display: 'grid',
                                            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                                            gap: isMobile ? 1.5 : 2,
                                            p: 2
                                        }}>
                                            {chaosDungeonRewards.map((chaos, index) => {
                                                const cardId = `chaos-${index}`;
                                                const isExpanded = expandedCards[cardId];
                                                return (
                                                    <RewardCard
                                                        key={index}
                                                        title={`레벨 ${chaos.minLevel}`}
                                                        goldValue={calculateRestGoldValue(chaos.reward, isChaosRestView)}
                                                        reward={chaos.reward}
                                                        isExpanded={isExpanded}
                                                        onToggle={() => toggleCard(cardId)}
                                                        formatReward={(reward) => formatRestReward(reward, isChaosRestView)}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion
                                    sx={{
                                        mb: 2,
                                        '&:before': {
                                            display: 'none',
                                        },
                                        '&:hover:not(:has(.MuiCard-root:hover))': {
                                            '& .MuiAccordionSummary-root': {
                                                backgroundColor: '#F6FFF0',
                                                transition: 'background-color 0.2s ease-in-out'
                                            },
                                            '& .MuiAccordionDetails-root': {
                                                backgroundColor: '#F6FFF0',
                                                transition: 'background-color 0.2s ease-in-out'
                                            }
                                        }
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandLessIcon/>}
                                        sx={{
                                            backgroundColor: 'background.paper',
                                        }}
                                    >
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, width: '100%', justifyContent: 'space-between'}}>
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                <Box
                                                    component="img"
                                                    src="/images/mokoko/guardian_mokoko.png"
                                                    alt="가디언 토벌 보상"
                                                    sx={{
                                                        width: '50px',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                                <Typography
                                                    variant="h5"
                                                    sx={{
                                                        color: 'primary.main',
                                                        fontWeight: 'bold',
                                                        fontSize: '1.5rem'
                                                    }}
                                                >
                                                    가디언 토벌 보상
                                                </Typography>
                                            </Box>
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                <RestViewButton
                                                    isActive={isGuardianRestView}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsGuardianRestView(!isGuardianRestView);
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{p: 0}}>
                                        <Box sx={{
                                            display: 'grid',
                                            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                                            gap: isMobile ? 1.5 : 2,
                                            p: 2
                                        }}>
                                            {guardianRewards.map((guardian, index) => {
                                                const cardId = `guardian-${index}`;
                                                const isExpanded = expandedCards[cardId];
                                                return (
                                                    <RewardCard
                                                        key={index}
                                                        title={guardian.name || `가디언 ${index + 1}`}
                                                        goldValue={calculateRestGoldValue(guardian.reward, isGuardianRestView)}
                                                        reward={guardian.reward}
                                                        isExpanded={isExpanded}
                                                        onToggle={() => toggleCard(cardId)}
                                                        formatReward={(reward) => formatRestReward(reward, isGuardianRestView)}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default ContentRewardPage; 