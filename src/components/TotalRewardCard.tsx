import React, { useState } from 'react';
import { Box, Typography, Avatar, Card, CardContent, Collapse } from '@mui/material';
import { Resource } from '../services/api';
import { ITEM_TRANSLATIONS } from '../types';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

interface TotalRewardCardProps {
  calculateTotalReward: () => {
    totalTradableGold: number;
    totalBoundGold: number;
    tradableResourceRewards: Record<string, { count: number; goldValue: number }>;
    boundResourceRewards: Record<string, { count: number; goldValue: number }>;
  };
  calculateRaidReward: () => {
    totalTradableGold: number;
    totalBoundGold: number;
    tradableResourceRewards: Record<string, { count: number; goldValue: number }>;
    boundResourceRewards: Record<string, { count: number; goldValue: number }>;
  };
  calculateChaosReward: () => {
    totalTradableGold: number;
    totalBoundGold: number;
    tradableResourceRewards: Record<string, { count: number; goldValue: number }>;
    boundResourceRewards: Record<string, { count: number; goldValue: number }>;
  };
  calculateGuardianReward: () => {
    totalTradableGold: number;
    totalBoundGold: number;
    tradableResourceRewards: Record<string, { count: number; goldValue: number }>;
    boundResourceRewards: Record<string, { count: number; goldValue: number }>;
  };
  resources: Resource[];
}

const TotalRewardCard: React.FC<TotalRewardCardProps> = ({
  calculateTotalReward,
  calculateRaidReward,
  calculateChaosReward,
  calculateGuardianReward,
  resources
}) => {
  const theme = useTheme();
  const [expandedSections, setExpandedSections] = useState({
    total: true,
    raid: true,
    chaos: true,
    guardian: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderResourceRewards = (
    rewards: Record<string, { count: number; goldValue: number }>
  ) => {
    let entries = Object.entries(rewards).filter(([_, value]) => value.count > 0);
    if (entries.length === 0) return null;
    // GOLD를 맨 앞으로, 나머지는 goldValue 내림차순 정렬
    entries = entries.sort((a, b) => {
      if (a[0] === 'GOLD') return -1;
      if (b[0] === 'GOLD') return 1;
      return b[1].goldValue - a[1].goldValue;
    });
    // 2개씩 한 행에 배치
    const rows = [];
    for (let i = 0; i < entries.length; i += 2) {
      rows.push(entries.slice(i, i + 2));
    }
    return (
      <Box sx={{ mt: 1, fontSize: '0.95rem' }}>
        {rows.map((row, idx) => (
          <Box key={idx} sx={{ display: 'flex', gap: 2, mb: 1, fontSize: '0.95rem' }}>
            {row.map(([resource, { count, goldValue }]) => (
              <Box key={resource} sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', fontSize: '0.95rem' }}>
                <Avatar
                  src={`/images/items/${resource}.png`}
                  alt={ITEM_TRANSLATIONS[resource] || resource}
                  sx={{ width: 25, height: 25 }}
                  variant="rounded"
                />
                {resource === 'GOLD' ? (
                  <Typography variant="body1" sx={{ fontWeight: 'bold', ml: 1, fontSize: '0.85rem' }}>
                    골드: <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{Math.floor(goldValue).toLocaleString()}G</span>
                  </Typography>
                ) : (
                  <Typography variant="body1" sx={{ ml: 1, fontSize: '0.85rem' }}>
                    {ITEM_TRANSLATIONS[resource] || resource}: {count.toLocaleString()}개 <span style={{ color: theme.palette.primary.main }}>{Math.floor(goldValue).toLocaleString()}G</span>
                  </Typography>
                )}
              </Box>
            ))}
            {/* row가 1개만 있을 때 오른쪽 칸 비우기 */}
            {row.length === 1 && <Box sx={{ flex: 1, fontSize: '0.95rem' }} />}
          </Box>
        ))}
      </Box>
    );
  };

  // 총 보상 섹션에서 거래 가능/귀속 리워드를 각각 받아서 표시
  const { totalTradableGold, totalBoundGold, tradableResourceRewards, boundResourceRewards } = calculateTotalReward();

  return (
    <Box sx={{ mb: 2, fontSize: '0.95rem' }}>
      <Card 
        sx={{ 
          mb: 2,
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          '&:hover': {
            backgroundColor: '#F6FFF0',
            boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
          },
          transition: 'all 0.2s ease',
        }}
        onClick={() => toggleSection('total')}
      >
        <CardContent sx={{ fontSize: '0.95rem', pt: 2, paddingBottom: '0.5rem !important' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', mr: 4, lineHeight: 1 }}>
              총 보상
            </Typography>
            <Box sx={{ display: 'flex', gap: 4 }}>
              {Math.floor(totalTradableGold) > 0 && (
                <Typography sx={{ fontSize: '0.95rem' }}>
                  거래 가능: <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{Math.floor(totalTradableGold).toLocaleString()}G</span>
                </Typography>
              )}
              {Math.floor(totalBoundGold) > 0 && (
                <Typography sx={{ fontSize: '0.95rem' }}>
                  귀속: <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{Math.floor(totalBoundGold).toLocaleString()}G</span>
                </Typography>
              )}
            </Box>
          </Box>
          <Collapse in={expandedSections.total} timeout={300}>
            {Object.keys(tradableResourceRewards).length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '1.1rem' }}>거래 가능</Typography>
                {renderResourceRewards(tradableResourceRewards)}
              </Box>
            )}
            {Object.keys(boundResourceRewards).length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '1.1rem' }}>귀속</Typography>
                {renderResourceRewards(boundResourceRewards)}
              </Box>
            )}
          </Collapse>
        </CardContent>
      </Card>

      <Box sx={{ mt: 2, fontSize: '0.95rem' }}>
        {/* 레이드 보상 */}
        {Math.floor(calculateRaidReward().totalTradableGold) > 0 || Math.floor(calculateRaidReward().totalBoundGold) > 0 ? (
          <Card 
            sx={{ 
              mb: 2,
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: '#F6FFF0',
                boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
              },
              transition: 'all 0.2s ease',
            }}
            onClick={() => toggleSection('raid')}
          >
            <CardContent sx={{ fontSize: '0.95rem', pt: 2, paddingBottom: '0.5rem !important' }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', mr: 4, lineHeight: 1 }}>
                  레이드 보상
                </Typography>
                <Box sx={{ display: 'flex', gap: 4 }}>
                  {Math.floor(calculateRaidReward().totalTradableGold) > 0 && (
                    <Typography sx={{ fontSize: '0.95rem' }}>
                      거래 가능: <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{Math.floor(calculateRaidReward().totalTradableGold).toLocaleString()}G</span>
                    </Typography>
                  )}
                  {Math.floor(calculateRaidReward().totalBoundGold) > 0 && (
                    <Typography sx={{ fontSize: '0.95rem' }}>
                      귀속: <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{Math.floor(calculateRaidReward().totalBoundGold).toLocaleString()}G</span>
                    </Typography>
                  )}
                </Box>
              </Box>
              <Collapse in={expandedSections.raid} timeout={300}>
                {Object.keys(calculateRaidReward().tradableResourceRewards).length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '1.1rem' }}>거래 가능</Typography>
                    {renderResourceRewards(calculateRaidReward().tradableResourceRewards)}
                  </Box>
                )}
                {Object.keys(calculateRaidReward().boundResourceRewards).length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '1.1rem' }}>귀속</Typography>
                    {renderResourceRewards(calculateRaidReward().boundResourceRewards)}
                  </Box>
                )}
              </Collapse>
            </CardContent>
          </Card>
        ) : null}

        {/* 카오스 던전 보상 */}
        {Math.floor(calculateChaosReward().totalTradableGold) > 0 || Math.floor(calculateChaosReward().totalBoundGold) > 0 ? (
          <Card 
            sx={{ 
              mb: 2,
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: '#F6FFF0',
                boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
              },
              transition: 'all 0.2s ease',
            }}
            onClick={() => toggleSection('chaos')}
          >
            <CardContent sx={{ fontSize: '0.95rem', pt: 2, paddingBottom: '0.5rem !important' }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', mr: 4, lineHeight: 1 }}>
                  카오스 던전 보상
                </Typography>
                <Box sx={{ display: 'flex', gap: 4 }}>
                  {Math.floor(calculateChaosReward().totalTradableGold) > 0 && (
                    <Typography sx={{ fontSize: '0.95rem' }}>
                      거래 가능: <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{Math.floor(calculateChaosReward().totalTradableGold).toLocaleString()}G</span>
                    </Typography>
                  )}
                  {Math.floor(calculateChaosReward().totalBoundGold) > 0 && (
                    <Typography sx={{ fontSize: '0.95rem' }}>
                      귀속: <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{Math.floor(calculateChaosReward().totalBoundGold).toLocaleString()}G</span>
                    </Typography>
                  )}
                </Box>
              </Box>
              <Collapse in={expandedSections.chaos} timeout={300}>
                {Object.keys(calculateChaosReward().tradableResourceRewards).length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '1.1rem' }}>거래 가능</Typography>
                    {renderResourceRewards(calculateChaosReward().tradableResourceRewards)}
                  </Box>
                )}
                {Object.keys(calculateChaosReward().boundResourceRewards).length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '1.1rem' }}>귀속</Typography>
                    {renderResourceRewards(calculateChaosReward().boundResourceRewards)}
                  </Box>
                )}
              </Collapse>
            </CardContent>
          </Card>
        ) : null}

        {/* 가디언 토벌 보상 */}
        {Math.floor(calculateGuardianReward().totalTradableGold) > 0 || Math.floor(calculateGuardianReward().totalBoundGold) > 0 ? (
          <Card 
            sx={{ 
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: '#F6FFF0',
                boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
              },
              transition: 'all 0.2s ease',
            }}
            onClick={() => toggleSection('guardian')}
          >
            <CardContent sx={{ fontSize: '0.95rem', pt: 2, paddingBottom: '0.5rem !important' }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', mr: 4, lineHeight: 1 }}>
                  가디언 토벌 보상
                </Typography>
                <Box sx={{ display: 'flex', gap: 4 }}>
                  {Math.floor(calculateGuardianReward().totalTradableGold) > 0 && (
                    <Typography sx={{ fontSize: '0.95rem' }}>
                      거래 가능: <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{Math.floor(calculateGuardianReward().totalTradableGold).toLocaleString()}G</span>
                    </Typography>
                  )}
                  {Math.floor(calculateGuardianReward().totalBoundGold) > 0 && (
                    <Typography sx={{ fontSize: '0.95rem' }}>
                      귀속: <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{Math.floor(calculateGuardianReward().totalBoundGold).toLocaleString()}G</span>
                    </Typography>
                  )}
                </Box>
              </Box>
              <Collapse in={expandedSections.guardian} timeout={300}>
                {Object.keys(calculateGuardianReward().tradableResourceRewards).length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '1.1rem' }}>거래 가능</Typography>
                    {renderResourceRewards(calculateGuardianReward().tradableResourceRewards)}
                  </Box>
                )}
                {Object.keys(calculateGuardianReward().boundResourceRewards).length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '1.1rem' }}>귀속</Typography>
                    {renderResourceRewards(calculateGuardianReward().boundResourceRewards)}
                  </Box>
                )}
              </Collapse>
            </CardContent>
          </Card>
        ) : null}
      </Box>
    </Box>
  );
};

export default TotalRewardCard; 