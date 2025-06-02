import React, { useState } from 'react';
import { Box, Typography, Avatar, Card, CardContent, Collapse } from '@mui/material';
import { Resource } from '../services/api';
import { ITEM_TRANSLATIONS } from '../types';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

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

const renderResourceRewards = (
  rewards: Record<string, { count: number; goldValue: number }> | undefined,
  isMobile: boolean,
  theme: any
) => {
  if (!rewards) return null;
  
  let entries = Object.entries(rewards).filter(([_, value]) => value.count > 0);
  if (entries.length === 0) return null;
  
  // GOLD를 맨 앞으로, 나머지는 goldValue 내림차순 정렬
  entries = entries.sort((a, b) => {
    if (a[0] === 'GOLD') return -1;
    if (b[0] === 'GOLD') return 1;
    return b[1].goldValue - a[1].goldValue;
  });
  
  // 2개씩 한 행에 배치 (PC 버전)
  const rows = [];
  for (let i = 0; i < entries.length; i += 2) {
    rows.push(entries.slice(i, i + 2));
  }
  
  return (
    <Box sx={{ mt: 1, fontSize: '0.95rem' }}>
      {rows.map((row, idx) => (
        <Box key={idx} sx={{ display: 'flex', gap: 2, mb: 1, fontSize: '0.95rem' }}>
          {row.map(([resource, { count, goldValue }]) => (
            <Box key={resource} sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: isMobile ? 'flex-start' : 'center', fontSize: '0.95rem' }}>
              {isMobile ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                      <Avatar
                        src={`/images/items/${resource}.png`}
                        alt={ITEM_TRANSLATIONS[resource] || resource}
                        sx={{ width: 25, height: 25 }}
                        variant="rounded"
                      />
                    </Box>
                    {resource === 'GOLD' ? (
                      <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                        골드
                      </Typography>
                    ) : (
                      <Typography variant="body1" sx={{ fontSize: '0.85rem' }}>
                        {ITEM_TRANSLATIONS[resource] || resource}: {count.toLocaleString()}개
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 25, height: 25 }} />
                    <Typography variant="body1" sx={{ fontSize: '0.85rem', color: theme.palette.primary.main }}>
                      {Math.floor(goldValue).toLocaleString()}G
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <>
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
                </>
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

const TotalRewardCard: React.FC<TotalRewardCardProps> = ({
  calculateTotalReward,
  calculateRaidReward,
  calculateChaosReward,
  calculateGuardianReward,
  resources
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:800px)');
  const [expandedSections, setExpandedSections] = useState({
    total: true,
    raid: false,
    chaos: false,
    guardian: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const totalReward = calculateTotalReward();
  const raidReward = calculateRaidReward();
  const chaosReward = calculateChaosReward();
  const guardianReward = calculateGuardianReward();

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
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: isMobile ? 'flex-start' : 'center', mb: 2, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 0 }}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', mr: isMobile ? 0 : 4, lineHeight: 1, whiteSpace: 'nowrap' }}>
              총 보상
            </Typography>
            <Box sx={{ display: 'flex', gap: isMobile ? 2 : 4, flexDirection: 'row', width: '100%' }}>
              {Math.floor(totalReward.totalTradableGold) > 0 && (
                <Typography sx={{ fontSize: '0.95rem' }}>
                  거래 가능: <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{Math.floor(totalReward.totalTradableGold).toLocaleString()}G</span>
                </Typography>
              )}
              {Math.floor(totalReward.totalBoundGold) > 0 && (
                <Typography sx={{ fontSize: '0.95rem' }}>
                  귀속: <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{Math.floor(totalReward.totalBoundGold).toLocaleString()}G</span>
                </Typography>
              )}
            </Box>
          </Box>
          <Collapse in={expandedSections.total}>
            {Object.keys(totalReward.tradableResourceRewards).length > 0 && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: theme.palette.text.primary }}>
                  거래 가능
                </Typography>
                {renderResourceRewards(totalReward.tradableResourceRewards, isMobile, theme)}
              </Box>
            )}
            {Object.keys(totalReward.boundResourceRewards).length > 0 && (
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: theme.palette.text.primary }}>
                  귀속
                </Typography>
                {renderResourceRewards(totalReward.boundResourceRewards, isMobile, theme)}
              </Box>
            )}
          </Collapse>
        </CardContent>
      </Card>

      <Box sx={{ mt: 2, fontSize: '0.95rem' }}>
        {/* 레이드 보상 */}
        {Math.floor(raidReward.totalTradableGold) > 0 || Math.floor(raidReward.totalBoundGold) > 0 ? (
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
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: isMobile ? 'flex-start' : 'center', mb: 2, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 0 }}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', mr: isMobile ? 0 : 4, lineHeight: 1, whiteSpace: 'nowrap' }}>
                  레이드 보상
                </Typography>
                <Box sx={{ display: 'flex', gap: isMobile ? 2 : 4, flexDirection: 'row', width: '100%' }}>
                  {Math.floor(raidReward.totalTradableGold) > 0 && (
                    <Typography sx={{ fontSize: '0.95rem' }}>
                      거래 가능: <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{Math.floor(raidReward.totalTradableGold).toLocaleString()}G</span>
                    </Typography>
                  )}
                  {Math.floor(raidReward.totalBoundGold) > 0 && (
                    <Typography sx={{ fontSize: '0.95rem' }}>
                      귀속: <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{Math.floor(raidReward.totalBoundGold).toLocaleString()}G</span>
                    </Typography>
                  )}
                </Box>
              </Box>
              <Collapse in={expandedSections.raid} timeout={300}>
                {Object.keys(raidReward.tradableResourceRewards).length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: theme.palette.text.primary }}>
                      거래 가능
                    </Typography>
                    {renderResourceRewards(raidReward.tradableResourceRewards, isMobile, theme)}
                  </Box>
                )}
                {Object.keys(raidReward.boundResourceRewards).length > 0 && (
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: theme.palette.text.primary }}>
                      귀속
                    </Typography>
                    {renderResourceRewards(raidReward.boundResourceRewards, isMobile, theme)}
                  </Box>
                )}
              </Collapse>
            </CardContent>
          </Card>
        ) : null}

        {/* 카오스 던전 보상 */}
        {Math.floor(chaosReward.totalTradableGold) > 0 || Math.floor(chaosReward.totalBoundGold) > 0 ? (
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
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: isMobile ? 'flex-start' : 'center', mb: 2, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 0 }}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', mr: isMobile ? 0 : 4, lineHeight: 1, whiteSpace: 'nowrap' }}>
                  카오스 던전 보상
                </Typography>
                <Box sx={{ display: 'flex', gap: isMobile ? 2 : 4, flexDirection: 'row', width: '100%' }}>
                  {Math.floor(chaosReward.totalTradableGold) > 0 && (
                    <Typography sx={{ fontSize: '0.95rem' }}>
                      거래 가능: <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{Math.floor(chaosReward.totalTradableGold).toLocaleString()}G</span>
                    </Typography>
                  )}
                  {Math.floor(chaosReward.totalBoundGold) > 0 && (
                    <Typography sx={{ fontSize: '0.95rem' }}>
                      귀속: <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{Math.floor(chaosReward.totalBoundGold).toLocaleString()}G</span>
                    </Typography>
                  )}
                </Box>
              </Box>
              <Collapse in={expandedSections.chaos} timeout={300}>
                {Object.keys(chaosReward.tradableResourceRewards).length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: theme.palette.text.primary }}>
                      거래 가능
                    </Typography>
                    {renderResourceRewards(chaosReward.tradableResourceRewards, isMobile, theme)}
                  </Box>
                )}
                {Object.keys(chaosReward.boundResourceRewards).length > 0 && (
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: theme.palette.text.primary }}>
                      귀속
                    </Typography>
                    {renderResourceRewards(chaosReward.boundResourceRewards, isMobile, theme)}
                  </Box>
                )}
              </Collapse>
            </CardContent>
          </Card>
        ) : null}

        {/* 가디언 토벌 보상 */}
        {Math.floor(guardianReward.totalTradableGold) > 0 || Math.floor(guardianReward.totalBoundGold) > 0 ? (
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
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: isMobile ? 'flex-start' : 'center', mb: 2, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 0 }}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', mr: isMobile ? 0 : 4, lineHeight: 1, whiteSpace: 'nowrap' }}>
                  가디언 토벌 보상
                </Typography>
                <Box sx={{ display: 'flex', gap: isMobile ? 2 : 4, flexDirection: 'row', width: '100%' }}>
                  {Math.floor(guardianReward.totalTradableGold) > 0 && (
                    <Typography sx={{ fontSize: '0.95rem' }}>
                      거래 가능: <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{Math.floor(guardianReward.totalTradableGold).toLocaleString()}G</span>
                    </Typography>
                  )}
                  {Math.floor(guardianReward.totalBoundGold) > 0 && (
                    <Typography sx={{ fontSize: '0.95rem' }}>
                      귀속: <span style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{Math.floor(guardianReward.totalBoundGold).toLocaleString()}G</span>
                    </Typography>
                  )}
                </Box>
              </Box>
              <Collapse in={expandedSections.guardian} timeout={300}>
                {Object.keys(guardianReward.tradableResourceRewards).length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: theme.palette.text.primary }}>
                      거래 가능
                    </Typography>
                    {renderResourceRewards(guardianReward.tradableResourceRewards, isMobile, theme)}
                  </Box>
                )}
                {Object.keys(guardianReward.boundResourceRewards).length > 0 && (
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: theme.palette.text.primary }}>
                      귀속
                    </Typography>
                    {renderResourceRewards(guardianReward.boundResourceRewards, isMobile, theme)}
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