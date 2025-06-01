import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Switch, FormControlLabel, IconButton, Tooltip, Collapse, Divider, List, ListItem, Checkbox, useMediaQuery, useTheme } from '@mui/material';
import { Character } from '../services/api';
import { RaidReward } from '../utils/raidTable';
import { Reward } from '../utils/rewardCalculator';
import { getSuitableChaosReward, getSuitableGuardianReward, calcChaosTradableGold, calcChaosBoundGold, calcGuardianTradableGold, calcGuardianBoundGold, calcRaidTradableGold, calcRaidBoundGold } from '../utils/rewardCalculator';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getClassImage } from '../utils/classImages';

interface ResultCharacterCardProps {
  character: Character;
  priceMap: Record<string, number>;
  raids: RaidReward[];
  selectedRaids: string[];
  isGoldReward: boolean;
  isExcluded: boolean;
  onGoldRewardChange: () => void;
  onExcludeChange: () => void;
  onRaidCheck: (raidName: string) => void;
  getSuitableChaosReward: (level: number) => Reward | null;
  getSuitableGuardianReward: (level: number) => Reward | null;
  chaosOption: number;
  guardianOption: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const ResultCharacterCard: React.FC<ResultCharacterCardProps> = ({
  character,
  priceMap,
  raids,
  selectedRaids,
  isGoldReward,
  isExcluded,
  onGoldRewardChange,
  onExcludeChange,
  onRaidCheck,
  getSuitableChaosReward,
  getSuitableGuardianReward,
  chaosOption,
  guardianOption,
  isExpanded,
  onToggle,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery('(max-width:1300px)');

  // 보상 계산
  let totalTradableGold = 0;
  let totalBoundGold = 0;
  const tradableResources: Record<string, { count: number, goldValue: number }> = {};
  const boundResources: Record<string, { count: number, goldValue: number }> = {};

  // 카오스 던전과 가디언 토벌 보상 계산
  const chaosReward = getSuitableChaosReward(character.level);
  const guardianReward = getSuitableGuardianReward(character.level);

  // 계산 제외된 캐릭터는 모든 골드를 0으로 처리
  if (!isExcluded) {
    // 카오스 던전 보상
    if (chaosReward && chaosOption !== 2) {
      const isRest = chaosOption === 1;
      totalTradableGold += calcChaosTradableGold(chaosReward, priceMap, isRest);
      totalBoundGold += calcChaosBoundGold(chaosReward, priceMap, isRest);

      // 재화 수급량 계산
      if (chaosReward.weaponStones) {
        Object.entries(chaosReward.weaponStones).forEach(([resource, count]) => {
          if (!tradableResources[resource]) {
            tradableResources[resource] = { count: 0, goldValue: 0 };
          }
          tradableResources[resource].count += count;
          tradableResources[resource].goldValue += count * (priceMap[resource] || 0);
        });
      }
      if (chaosReward.armorStones) {
        Object.entries(chaosReward.armorStones).forEach(([resource, count]) => {
          if (!tradableResources[resource]) {
            tradableResources[resource] = { count: 0, goldValue: 0 };
          }
          tradableResources[resource].count += count;
          tradableResources[resource].goldValue += count * (priceMap[resource] || 0);
        });
      }
      if (chaosReward.shards) {
        Object.entries(chaosReward.shards).forEach(([resource, count]) => {
          if (!boundResources[resource]) {
            boundResources[resource] = { count: 0, goldValue: 0 };
          }
          boundResources[resource].count += count;
          boundResources[resource].goldValue += count * (priceMap[resource] || 0);
        });
      }
      if (chaosReward.gems) {
        Object.entries(chaosReward.gems).forEach(([grade, count]) => {
          const resource = `GEM_TIER_${grade}`;
          if (!tradableResources[resource]) {
            tradableResources[resource] = { count: 0, goldValue: 0 };
          }
          tradableResources[resource].count += count;
          tradableResources[resource].goldValue += count * (priceMap[resource] || 0);
        });
      }
      if (chaosReward.leapStones) {
        Object.entries(chaosReward.leapStones).forEach(([resource, count]) => {
          if (!boundResources[resource]) {
            boundResources[resource] = { count: 0, goldValue: 0 };
          }
          boundResources[resource].count += count;
          boundResources[resource].goldValue += count * (priceMap[resource] || 0);
        });
      }
    }

    // 가디언 토벌 보상
    if (guardianReward && guardianOption !== 2) {
      const isRest = guardianOption === 1;
      totalTradableGold += calcGuardianTradableGold(guardianReward, priceMap, isRest);
      totalBoundGold += calcGuardianBoundGold(guardianReward, priceMap, isRest);

      // 재화 수급량 계산
      if (guardianReward.weaponStones) {
        Object.entries(guardianReward.weaponStones).forEach(([resource, count]) => {
          if (!tradableResources[resource]) {
            tradableResources[resource] = { count: 0, goldValue: 0 };
          }
          tradableResources[resource].count += count;
          tradableResources[resource].goldValue += count * (priceMap[resource] || 0);
        });
      }
      if (guardianReward.armorStones) {
        Object.entries(guardianReward.armorStones).forEach(([resource, count]) => {
          if (!tradableResources[resource]) {
            tradableResources[resource] = { count: 0, goldValue: 0 };
          }
          tradableResources[resource].count += count;
          tradableResources[resource].goldValue += count * (priceMap[resource] || 0);
        });
      }
      if (guardianReward.shards) {
        Object.entries(guardianReward.shards).forEach(([resource, count]) => {
          if (!boundResources[resource]) {
            boundResources[resource] = { count: 0, goldValue: 0 };
          }
          boundResources[resource].count += count;
          boundResources[resource].goldValue += count * (priceMap[resource] || 0);
        });
      }
      if (guardianReward.leapStones) {
        Object.entries(guardianReward.leapStones).forEach(([resource, count]) => {
          if (!tradableResources[resource]) {
            tradableResources[resource] = { count: 0, goldValue: 0 };
          }
          tradableResources[resource].count += count;
          tradableResources[resource].goldValue += count * (priceMap[resource] || 0);
        });
      }
      if (guardianReward.gems) {
        Object.entries(guardianReward.gems).forEach(([grade, count]) => {
          const resource = `GEM_TIER_${grade}`;
          if (!tradableResources[resource]) {
            tradableResources[resource] = { count: 0, goldValue: 0 };
          }
          tradableResources[resource].count += count;
          tradableResources[resource].goldValue += count * (priceMap[resource] || 0);
        });
      }
    }

    // 레이드 보상
    raids.forEach(raid => {
      if (selectedRaids.includes(raid.name)) {
        const reward = isGoldReward ? raid.goldReward : raid.nonGoldReward;
        totalTradableGold += calcRaidTradableGold(reward, priceMap);
        totalBoundGold += calcRaidBoundGold(reward, priceMap);

        // 재화 수급량 계산
        if (reward.weaponStones) {
          Object.entries(reward.weaponStones).forEach(([resource, count]) => {
            if (!boundResources[resource]) {
              boundResources[resource] = { count: 0, goldValue: 0 };
            }
            boundResources[resource].count += count;
            boundResources[resource].goldValue += count * (priceMap[resource] || 0);
          });
        }
        if (reward.armorStones) {
          Object.entries(reward.armorStones).forEach(([resource, count]) => {
            if (!boundResources[resource]) {
              boundResources[resource] = { count: 0, goldValue: 0 };
            }
            boundResources[resource].count += count;
            boundResources[resource].goldValue += count * (priceMap[resource] || 0);
          });
        }
        if (reward.shards) {
          Object.entries(reward.shards).forEach(([resource, count]) => {
            if (!boundResources[resource]) {
              boundResources[resource] = { count: 0, goldValue: 0 };
            }
            boundResources[resource].count += count;
            boundResources[resource].goldValue += count * (priceMap[resource] || 0);
          });
        }
        if (reward.leapStones) {
          Object.entries(reward.leapStones).forEach(([resource, count]) => {
            if (!boundResources[resource]) {
              boundResources[resource] = { count: 0, goldValue: 0 };
            }
            boundResources[resource].count += count;
            boundResources[resource].goldValue += count * (priceMap[resource] || 0);
          });
        }
        if (reward.gems) {
          Object.entries(reward.gems).forEach(([grade, count]) => {
            const resource = `GEM_TIER_${grade}`;
            if (!tradableResources[resource]) {
              tradableResources[resource] = { count: 0, goldValue: 0 };
            }
            tradableResources[resource].count += count;
            tradableResources[resource].goldValue += count * (priceMap[resource] || 0);
          });
        }
      }
    });
  }

  return (
    <Card 
      sx={{ 
        mb: 2, 
        position: 'relative',
        cursor: 'pointer'
      }}
      onClick={onToggle}
    >
      <CardContent>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: isSmallScreen ? 'column' : 'row',
            alignItems: isSmallScreen ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: isSmallScreen ? 1 : 0
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flex: 1,
              width: '100%',
              gap: 1
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: 'text.primary'
              }}
            >
              {character.characterName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              <img 
                src={getClassImage(character.className)} 
                alt={character.className}
                style={{ 
                  height: 28,
                  filter: 'brightness(0)'
                }}
              />
              <Typography color="text.secondary">
                Lv.{character.level}
              </Typography>
            </Box>
          </Box>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              width: isSmallScreen ? '100%' : 'auto',
              justifyContent: isSmallScreen ? 'flex-start' : 'flex-start'
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={isGoldReward}
                  onChange={onGoldRewardChange}
                  size="small"
                  onClick={(e) => e.stopPropagation()}
                />
              }
              label="골드 보상"
              sx={{ mr: 1 }}
              onClick={(e) => e.stopPropagation()}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={isExcluded}
                  onChange={onExcludeChange}
                  size="small"
                  onClick={(e) => e.stopPropagation()}
                />
              }
              label="제외"
              onClick={(e) => e.stopPropagation()}
            />
          </Box>
        </Box>
        <Box 
          sx={{ 
            mt: 1, 
            display: 'flex', 
            justifyContent: isSmallScreen ? 'flex-start' : 'flex-end',
            flexDirection: 'column',
            alignItems: isSmallScreen ? 'flex-start' : 'flex-end',
            gap: 1
          }}
        >
          <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
            {!isExcluded && totalTradableGold > 0 && (
              <span style={{ color: theme.palette.primary.main }}>
                거래 가능: {Math.floor(totalTradableGold).toLocaleString()}G
              </span>
            )}
            {!isExcluded && totalTradableGold > 0 && totalBoundGold > 0 && (
              <span style={{ marginLeft: '16px', color: theme.palette.primary.main }}>
                귀속: {Math.floor(totalBoundGold).toLocaleString()}G
              </span>
            )}
            {!isExcluded && totalTradableGold === 0 && totalBoundGold > 0 && (
              <span style={{ color: theme.palette.primary.main }}>
                귀속: {Math.floor(totalBoundGold).toLocaleString()}G
              </span>
            )}
            {isExcluded && (
              <span style={{ color: theme.palette.text.secondary }}>계산 제외됨</span>
            )}
          </Typography>
        </Box>

        <Collapse in={isExpanded} timeout={300}>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            {/* 왼쪽: 보상 정보 */}
            <Box sx={{ flex: 1 }}>
              {/* 카오스 던전 보상 */}
              <Box sx={{ p: 1, bgcolor: 'reward.background', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>카오스 던전 보상</Typography>
                {!isExcluded && chaosReward && chaosOption !== 2 && (
                  <>
                    {calcChaosTradableGold(chaosReward, priceMap, chaosOption === 1) > 0 && (
                      <Typography sx={{ color: theme.palette.primary.main }}>거래 가능: {Math.floor(calcChaosTradableGold(chaosReward, priceMap, chaosOption === 1)).toLocaleString()} G</Typography>
                    )}
                    {calcChaosBoundGold(chaosReward, priceMap, chaosOption === 1) > 0 && (
                      <Typography sx={{ color: theme.palette.primary.main }}>귀속: {Math.floor(calcChaosBoundGold(chaosReward, priceMap, chaosOption === 1)).toLocaleString()} G</Typography>
                    )}
                  </>
                )}
                {isExcluded && (
                  <Typography color="text.secondary">계산 제외됨</Typography>
                )}
                {!isExcluded && chaosOption === 2 && (
                  <Typography color="text.secondary">계산하지 않음</Typography>
                )}
              </Box>

              {/* 가디언 토벌 보상 */}
              <Box sx={{ mt: 1, p: 1, bgcolor: 'reward.background', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>가디언 토벌 보상</Typography>
                {!isExcluded && guardianReward && guardianOption !== 2 && (
                  <>
                    {calcGuardianTradableGold(guardianReward, priceMap, guardianOption === 1) > 0 && (
                      <Typography sx={{ color: theme.palette.primary.main }}>거래 가능: {Math.floor(calcGuardianTradableGold(guardianReward, priceMap, guardianOption === 1)).toLocaleString()} G</Typography>
                    )}
                    {calcGuardianBoundGold(guardianReward, priceMap, guardianOption === 1) > 0 && (
                      <Typography sx={{ color: theme.palette.primary.main }}>귀속: {Math.floor(calcGuardianBoundGold(guardianReward, priceMap, guardianOption === 1)).toLocaleString()} G</Typography>
                    )}
                  </>
                )}
                {isExcluded && (
                  <Typography color="text.secondary">계산 제외됨</Typography>
                )}
                {!isExcluded && guardianOption === 2 && (
                  <Typography color="text.secondary">계산하지 않음</Typography>
                )}
              </Box>

              {/* 레이드 보상 */}
              <Box sx={{ mt: 1, p: 1, bgcolor: 'reward.background', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>레이드 보상</Typography>
                {!isExcluded && (() => {
                  const tradableGold = raids.reduce((sum, raid) => 
                    selectedRaids.includes(raid.name) ? 
                      sum + calcRaidTradableGold(isGoldReward ? raid.goldReward : raid.nonGoldReward, priceMap) : 
                      sum, 0
                  );
                  const boundGold = raids.reduce((sum, raid) => 
                    selectedRaids.includes(raid.name) ? 
                      sum + calcRaidBoundGold(isGoldReward ? raid.goldReward : raid.nonGoldReward, priceMap) : 
                      sum, 0
                  );
                  return (
                    <>
                      {tradableGold > 0 && (
                        <Typography sx={{ color: theme.palette.primary.main }}>거래 가능: {Math.floor(tradableGold).toLocaleString()} G</Typography>
                      )}
                      {boundGold > 0 && (
                        <Typography sx={{ color: theme.palette.primary.main }}>귀속: {Math.floor(boundGold).toLocaleString()} G</Typography>
                      )}
                    </>
                  );
                })()}
                {isExcluded && (
                  <Typography color="text.secondary">계산 제외됨</Typography>
                )}
              </Box>
            </Box>

            {/* 오른쪽: 레이드 목록 */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>레이드</Typography>
              <List dense sx={{ py: 0 }}>
                {raids.map((raid) => (
                  <ListItem 
                    key={raid.name} 
                    disablePadding 
                    sx={{ 
                      minHeight: '32px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedRaids.includes(raid.name)}
                          onChange={() => onRaidCheck(raid.name)}
                          size="small"
                          onClick={(e) => e.stopPropagation()}
                        />
                      }
                      label={
                        <Typography variant="body2">
                          {raid.name}
                        </Typography>
                      }
                      sx={{ 
                        my: 0, 
                        width: '100%',
                        cursor: 'pointer'
                      }}
                      onChange={() => onRaidCheck(raid.name)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default ResultCharacterCard; 