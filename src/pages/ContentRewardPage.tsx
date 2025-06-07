import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  GlobalStyles
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import { raidRewards } from '../utils/raidTable';
import { chaosDungeonRewards, guardianRewards } from '../utils/rewardTables';
import { Reward } from '../utils/rewardCalculator';
import { ITEM_TRANSLATIONS } from '../types';
import { api } from '../services/api';

interface Resource {
  item: string;
  avgPrice: number;
  id: number;
}

const ContentRewardPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPriceEditor, setShowPriceEditor] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.getResourcePrices();
        setResources(response);
        setLoading(false);
      } catch (error) {
        console.error('시세 데이터 로딩 중 오류 발생:', error);
        navigate('/', { state: { error: '시세 데이터를 불러오는 중 오류가 발생했습니다.' } });
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
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
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
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
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
        minHeight: '100vh',
        display: 'flex', 
        flexDirection: 'column',
        pb: 20
      }}>
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1200,
          backgroundColor: 'background.paper',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          py: 2,
          px: { xs: 2, sm: 4 },
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            maxWidth: '1200px',
            mx: 'auto',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <img
                src="/images/common/gold_mokoko.png"
                alt="로생계산기"
                style={{
                  height: 48,
                  width: 'auto',
                  display: 'block',
                }}
              />
              <Typography 
                variant="h3"
                component="h1"
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 'bold',
                  lineHeight: 1,
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                }}
              >
                컨텐츠 보상
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => navigate('/')} 
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'primary.main',
                borderColor: 'primary.main',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                padding: '8px 16px',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'white',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                }
              }}
            >
              <img 
                src="/images/common/hello_mokoko.png"
                alt="로생계산기" 
                style={{ 
                  height: 32,
                  width: 'auto',
                  display: 'block'
                }}
              />
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}
              >
                돌아가기
              </Typography>
            </Button>
          </Box>
        </Box>
        <Box sx={{ pt: '84px', overflow: 'auto' }}>
          <Box sx={{ maxWidth: '1200px', mx: 'auto', width: '100%' }}>
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
            <Box sx={{ p: 2 }}>
              <Accordion 
                sx={{
                  mb: 2,
                  '&:before': {
                    display: 'none',
                  },
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandLessIcon />}
                  sx={{
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      backgroundColor: 'background.paper',
                    },
                  }}
                >
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
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  {raidRewards.map((raid, index) => {
                    const cardId = `raid-${index}`;
                    const isExpanded = expandedCards[cardId];
                    return (
                      <Card
                        key={index}
                        elevation={2}
                        sx={{
                          mb: 2,
                          mx: 2,
                          backgroundColor: index % 2 === 0 ? 'background.paper' : 'action.hover',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            elevation: 4,
                          },
                        }}
                        onClick={() => toggleCard(cardId)}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ color: 'text.primary' }}>
                              {raid.name}
                            </Typography>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                color: 'primary.main',
                                fontWeight: 'bold'
                              }}
                            >
                              총 골드 가치: {Math.floor(calculateGoldValue(raid.goldReward)).toLocaleString()}G
                            </Typography>
                          </Box>
                          <Collapse in={isExpanded} timeout={300}>
                            <Box sx={{ mt: 2 }}>
                              <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                  color: 'primary.main',
                                  fontWeight: 'bold',
                                  mb: 1
                                }}
                              >
                                골드 보상
                              </Typography>
                              {formatReward(raid.goldReward).map((detail, detailIndex) => (
                                <Box 
                                  key={detailIndex} 
                                  sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    mb: 0.5 
                                  }}
                                >
                                  <Avatar
                                    src={detail.image}
                                    alt={detail.name}
                                    sx={{ width: 24, height: 24, mr: 1 }}
                                    variant="rounded"
                                  />
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                  >
                                    {detail.name}: {detail.count.toLocaleString()}
                                    {detail.goldValue !== undefined && (
                                      <span style={{ color: 'primary.main', marginLeft: '4px' }}>
                                        ({Math.floor(detail.goldValue).toLocaleString()}G)
                                      </span>
                                    )}
                                  </Typography>
                                </Box>
                              ))}
                              <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                  color: 'primary.main',
                                  fontWeight: 'bold',
                                  mt: 2,
                                  mb: 1
                                }}
                              >
                                더보기할 경우 재화 수급량
                              </Typography>
                              {formatReward(raid.nonGoldReward).map((detail, detailIndex) => (
                                <Box 
                                  key={detailIndex} 
                                  sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    mb: 0.5 
                                  }}
                                >
                                  <Avatar
                                    src={detail.image}
                                    alt={detail.name}
                                    sx={{ width: 24, height: 24, mr: 1 }}
                                    variant="rounded"
                                  />
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                  >
                                    {detail.name}: {detail.count.toLocaleString()}
                                    {detail.goldValue !== undefined && (
                                      <span style={{ color: 'primary.main', marginLeft: '4px' }}>
                                        ({Math.floor(detail.goldValue).toLocaleString()}G)
                                      </span>
                                    )}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </Collapse>
                        </CardContent>
                      </Card>
                    );
                  })}
                </AccordionDetails>
              </Accordion>

              <Accordion 
                sx={{
                  mb: 2,
                  '&:before': {
                    display: 'none',
                  },
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandLessIcon />}
                  sx={{
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      backgroundColor: 'background.paper',
                    },
                  }}
                >
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
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  {chaosDungeonRewards.map((chaos, index) => {
                    const cardId = `chaos-${index}`;
                    const isExpanded = expandedCards[cardId];
                    return (
                      <Card
                        key={index}
                        elevation={2}
                        sx={{
                          mb: 2,
                          mx: 2,
                          backgroundColor: index % 2 === 0 ? 'background.paper' : 'action.hover',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            elevation: 4,
                          },
                        }}
                        onClick={() => toggleCard(cardId)}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ color: 'text.primary' }}>
                              레벨 {chaos.minLevel}
                            </Typography>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                color: 'primary.main',
                                fontWeight: 'bold'
                              }}
                            >
                              총 골드 가치: {Math.floor(calculateGoldValue(chaos.reward)).toLocaleString()}G
                            </Typography>
                          </Box>
                          <Collapse in={isExpanded} timeout={300}>
                            <Box sx={{ mt: 2 }}>
                              {formatReward(chaos.reward).map((detail, detailIndex) => (
                                <Box 
                                  key={detailIndex} 
                                  sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    mb: 0.5 
                                  }}
                                >
                                  <Avatar
                                    src={detail.image}
                                    alt={detail.name}
                                    sx={{ width: 24, height: 24, mr: 1 }}
                                    variant="rounded"
                                  />
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                  >
                                    {detail.name}: {detail.count.toLocaleString()}
                                    {detail.goldValue !== undefined && (
                                      <span style={{ color: 'primary.main', marginLeft: '4px' }}>
                                        ({Math.floor(detail.goldValue).toLocaleString()}G)
                                      </span>
                                    )}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </Collapse>
                        </CardContent>
                      </Card>
                    );
                  })}
                </AccordionDetails>
              </Accordion>

              <Accordion 
                sx={{
                  mb: 2,
                  '&:before': {
                    display: 'none',
                  },
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandLessIcon />}
                  sx={{
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      backgroundColor: 'background.paper',
                    },
                  }}
                >
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
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  {guardianRewards.map((guardian, index) => {
                    const cardId = `guardian-${index}`;
                    const isExpanded = expandedCards[cardId];
                    return (
                      <Card
                        key={index}
                        elevation={2}
                        sx={{
                          mb: 2,
                          mx: 2,
                          backgroundColor: index % 2 === 0 ? 'background.paper' : 'action.hover',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            elevation: 4,
                          },
                        }}
                        onClick={() => toggleCard(cardId)}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ color: 'text.primary' }}>
                              {guardian.name} ({guardian.minLevel})
                            </Typography>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                color: 'primary.main',
                                fontWeight: 'bold'
                              }}
                            >
                              총 골드 가치: {Math.floor(calculateGoldValue(guardian.reward)).toLocaleString()}G
                            </Typography>
                          </Box>
                          <Collapse in={isExpanded} timeout={300}>
                            <Box sx={{ mt: 2 }}>
                              {formatReward(guardian.reward).map((detail, detailIndex) => (
                                <Box 
                                  key={detailIndex} 
                                  sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    mb: 0.5 
                                  }}
                                >
                                  <Avatar
                                    src={detail.image}
                                    alt={detail.name}
                                    sx={{ width: 24, height: 24, mr: 1 }}
                                    variant="rounded"
                                  />
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                  >
                                    {detail.name}: {detail.count.toLocaleString()}
                                    {detail.goldValue !== undefined && (
                                      <span style={{ color: 'primary.main', marginLeft: '4px' }}>
                                        ({Math.floor(detail.goldValue).toLocaleString()}G)
                                      </span>
                                    )}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </Collapse>
                        </CardContent>
                      </Card>
                    );
                  })}
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ContentRewardPage; 