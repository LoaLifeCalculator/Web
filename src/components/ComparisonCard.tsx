import React from 'react';
import { Card, CardContent, Typography, Box, Collapse, IconButton, Avatar } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { ITEM_TRANSLATIONS } from '../types';
import RaidSelector from './RaidSelector';
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface ComparisonCardProps {
  mainReward: any;
  compareReward: any;
  compareLevel: number | null;
  selectedCompareRaids: string[];
  onCompareRaidToggle: (name: string) => void;
  isMobile: boolean;
}

const ExpandMore = styled((props: any) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ComparisonCard: React.FC<ComparisonCardProps> = ({ 
  mainReward, 
  compareReward, 
  compareLevel,
  selectedCompareRaids,
  onCompareRaidToggle,
  isMobile,
}) => {
  const [expanded, setExpanded] = React.useState(true);
  const theme = useTheme();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (!mainReward || !compareReward) return null;

  const calculateDifference = (main: number, compare: number) => {
    if (main === 0 && compare === 0) return null;
    const diff = main - compare;
    const percentage = compare === 0 ? 100 : (diff / compare) * 100;
    return { diff, percentage };
  };

  const formatDifference = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${Math.floor(value).toLocaleString()}`;
  };

  const getDifferenceColor = (value: number) => {
    if (value > 0) return 'success.main';
    if (value < 0) return 'error.main';
    return 'text.primary';
  };

  const getItemName = (item: string) => {
    if (item === 'GOLD') return '골드';
    return ITEM_TRANSLATIONS[item] || item;
  };

  const renderRewardDifference = (mainReward: any, compareReward: any, type: 'tradable' | 'bound') => {
    const rewards = {
      '레이드 보상': type === 'tradable' ? mainReward.raidTradableGold : mainReward.raidBoundGold,
      '카오스 던전 보상': type === 'tradable' ? mainReward.chaosTradableGold : mainReward.chaosBoundGold,
      '가디언 토벌 보상': type === 'tradable' ? mainReward.guardianTradableGold : mainReward.guardianBoundGold
    };

    return Object.entries(rewards)
      .filter(([_, value]) => {
        let compareValue = 0;
        switch (_) {
          case '레이드 보상':
            compareValue = type === 'tradable' ? compareReward.raidTradableGold : compareReward.raidBoundGold;
            break;
          case '카오스 던전 보상':
            compareValue = type === 'tradable' ? compareReward.chaosTradableGold : compareReward.chaosBoundGold;
            break;
          case '가디언 토벌 보상':
            compareValue = type === 'tradable' ? compareReward.guardianTradableGold : compareReward.guardianBoundGold;
            break;
        }
        const difference = calculateDifference(Number(value), Number(compareValue));
        return difference !== null;
      })
      .map(([key, value]) => {
        let compareValue = 0;
        switch (key) {
          case '레이드 보상':
            compareValue = type === 'tradable' ? compareReward.raidTradableGold : compareReward.raidBoundGold;
            break;
          case '카오스 던전 보상':
            compareValue = type === 'tradable' ? compareReward.chaosTradableGold : compareReward.chaosBoundGold;
            break;
          case '가디언 토벌 보상':
            compareValue = type === 'tradable' ? compareReward.guardianTradableGold : compareReward.guardianBoundGold;
            break;
        }
        const difference = calculateDifference(Number(value), Number(compareValue));
        if (difference === null) return null;

        const { diff } = difference;
        return (
          <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {key}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: diff < 0 ? 'error.main' : 'primary.main',
                fontWeight: 'bold'
              }}
            >
              {formatDifference(diff)}
            </Typography>
          </Box>
        );
      }).filter(Boolean);
  };

  const renderResourceDifference = (mainReward: any, compareReward: any, type: 'tradable' | 'bound') => {
    const mainResources = type === 'tradable' ? mainReward.tradableResourceRewards : mainReward.boundResourceRewards;
    const compareResources = type === 'tradable' ? compareReward.tradableResourceRewards : compareReward.boundResourceRewards;
    const allItems = new Set([...Object.keys(mainResources), ...Object.keys(compareResources)]);

    const entries = Array.from(allItems)
        .filter(item => {
            const mainCount = mainResources[item]?.count || 0;
            const compareCount = compareResources[item]?.count || 0;
            const difference = calculateDifference(mainCount, compareCount);
            return difference !== null;
        })
        .sort((a, b) => {
            if (a === 'GOLD') return -1;
            if (b === 'GOLD') return 1;
            return 0;
        });

    const positiveItems: React.ReactNode[] = [];
    const negativeItems: React.ReactNode[] = [];

    entries.forEach(resource => {
        const mainCount = mainResources[resource]?.count || 0;
        const compareCount = compareResources[resource]?.count || 0;
        const difference = calculateDifference(mainCount, compareCount);
        if (difference === null) return;

        const { diff } = difference;
        const goldValueDifference = calculateDifference(
            mainResources[resource]?.goldValue || 0,
            compareResources[resource]?.goldValue || 0
        );
        if (goldValueDifference === null) return;

        const itemElement = (
            <Box
                key={resource}
                sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
            >
                <Avatar
                    src={`/images/items/${resource}.png`}
                    alt={resource === 'GOLD' ? '골드' : ITEM_TRANSLATIONS[resource] || resource}
                    variant="rounded"
                    sx={{ width: 24, height: 24, mr: 1 }}
                />
                <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{
                        fontWeight: resource === 'GOLD' ? 'bold' : 'normal',
                        '& > span': {
                            color: resource === 'GOLD' ? theme.palette.primary.main : 'inherit',
                        },
                    }}
                >
                    {resource === 'GOLD' ? '골드' : ITEM_TRANSLATIONS[resource] || resource}: <span style={{ color: diff < 0 ? theme.palette.error.main : theme.palette.primary.main }}>{formatDifference(diff)}</span>
                    {resource !== 'GOLD' && (
                        <span style={{ color: goldValueDifference.diff < 0 ? theme.palette.error.main : theme.palette.primary.main, marginLeft: 4 }}>
                            {formatDifference(goldValueDifference.diff)}G
                        </span>
                    )}
                </Typography>
            </Box>
        );

        if (diff > 0) {
            positiveItems.push(itemElement);
        } else if (diff < 0) {
            negativeItems.push(itemElement);
        }
    });

    if (isMobile) {
        return [...positiveItems, ...negativeItems];
    }

    return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
                {positiveItems}
            </Box>
            <Box sx={{ flex: 1 }}>
                {negativeItems}
            </Box>
        </Box>
    );
  };

  return (
    <Card 
      sx={{ 
        width: '100%', 
        mb: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
        },
        cursor: 'pointer',
        borderRadius: 2,
        backgroundColor: '#fafafa',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}
      onClick={handleExpandClick}
    >
      <CardContent sx={{ 
        pb: expanded ? 2 : 1,
        '&:last-child': {
          pb: expanded ? 2 : 1
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            레벨 비교 결과
          </Typography>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleExpandClick();
            }}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandLessIcon
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }}
            />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
          <Typography>
            거래 가능:{' '}
            <span style={{ 
              color: mainReward.totalTradableGold - compareReward.totalTradableGold < 0 ? theme.palette.error.main : theme.palette.primary.main,
              fontWeight: 'bold'
            }}>
              {formatDifference(mainReward.totalTradableGold - compareReward.totalTradableGold)}G
            </span>
          </Typography>
          <Typography>
            귀속:{' '}
            <span style={{ 
              color: mainReward.totalBoundGold - compareReward.totalBoundGold < 0 ? theme.palette.error.main : theme.palette.primary.main,
              fontWeight: 'bold'
            }}>
              {formatDifference(mainReward.totalBoundGold - compareReward.totalBoundGold)}G
            </span>
          </Typography>
        </Box>
        <Collapse in={expanded} timeout={300}>
          <Box sx={{ mt: 2 }}>
            {compareLevel && (
              <Box 
                sx={{ mb: 2 }}
                onClick={(e) => e.stopPropagation()}
              >
                <RaidSelector
                  level={compareLevel}
                  selectedRaids={selectedCompareRaids}
                  onToggleRaid={onCompareRaidToggle}
                  isMobile={isMobile}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                  거래 가능 보상 차이
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {renderRewardDifference(mainReward, compareReward, 'tradable')}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                  귀속 보상 차이
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {renderRewardDifference(mainReward, compareReward, 'bound')}
                </Box>
              </Box>
            </Box>

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
              거래 가능 재화 수량 차이
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {renderResourceDifference(mainReward, compareReward, 'tradable')}
            </Box>

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
              귀속 재화 수량 차이
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {renderResourceDifference(mainReward, compareReward, 'bound')}
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default ComparisonCard; 