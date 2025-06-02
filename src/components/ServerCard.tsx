import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton, useTheme, useMediaQuery, Collapse, Switch, FormControlLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Character } from '../services/api';
import ResultCharacterCard from './ResultCharacterCard';
import { RaidReward } from '../utils/raidTable';

interface ServerCardProps {
  server: string;
  characters: Character[];
  expanded: boolean;
  onToggle: () => void;
  selectedRaids: Record<string, string[]>;
  goldRewardStates: Record<string, boolean>;
  excludeStates: Record<string, boolean>;
  onRaidCheck: (characterName: string, raidName: string) => void;
  onGoldRewardChange: (characterName: string) => void;
  onExcludeChange: (characterName: string) => void;
  priceMap: Record<string, number>;
  getAvailableRaids: (level: number) => RaidReward[];
  getSuitableChaosReward: (level: number) => any;
  getSuitableGuardianReward: (level: number) => any;
  chaosOption: number;
  guardianOption: number;
  expandedCharacters: Record<string, boolean>;
  onCharacterToggle: (server: string, characterName: string) => void;
  calculateServerTotalReward: (server: string) => { totalTradableGold: number; totalBoundGold: number };
  isServerExcluded: boolean;
  onServerExcludeChange: (server: string) => void;
}

const ServerCard: React.FC<ServerCardProps> = ({
  server,
  characters,
  expanded,
  onToggle,
  selectedRaids,
  goldRewardStates,
  excludeStates,
  onRaidCheck,
  onGoldRewardChange,
  onExcludeChange,
  priceMap,
  getAvailableRaids,
  getSuitableChaosReward,
  getSuitableGuardianReward,
  chaosOption,
  guardianOption,
  expandedCharacters,
  onCharacterToggle,
  calculateServerTotalReward,
  isServerExcluded,
  onServerExcludeChange
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:800px)');
  const [isHoveringCharacters, setIsHoveringCharacters] = useState(false);

  return (
    <Card 
      sx={{ 
        mb: 2,
        cursor: 'pointer',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: '#F7F7F7',
        '&:hover': {
          backgroundColor: isHoveringCharacters ? '#F7F7F7' : '#F6FFF0',
        },
        transition: 'background-color 0.2s ease',
      }}
      onClick={onToggle}
    >
      <CardContent>
        <Box display="flex" flexDirection="column" gap={1}>
          {/* 1행: 서버명과 거래 가능/귀속 (PC), 또는 서버명만 (모바일) */}
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5" sx={{ color: 'text.primary', fontSize: '1.5rem', fontWeight: 'bold' }}>{server}</Typography>
              {!isMobile && (
                <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
                  {!isServerExcluded && calculateServerTotalReward(server).totalTradableGold > 0 && (
                    <span style={{ color: theme.palette.primary.main }}>
                      거래 가능: {Math.floor(calculateServerTotalReward(server).totalTradableGold).toLocaleString()}G
                    </span>
                  )}
                  {!isServerExcluded && calculateServerTotalReward(server).totalTradableGold > 0 && calculateServerTotalReward(server).totalBoundGold > 0 && (
                    <span style={{ marginLeft: '16px', color: theme.palette.primary.main }}>
                      귀속: {Math.floor(calculateServerTotalReward(server).totalBoundGold).toLocaleString()}G
                    </span>
                  )}
                  {!isServerExcluded && calculateServerTotalReward(server).totalTradableGold === 0 && calculateServerTotalReward(server).totalBoundGold > 0 && (
                    <span style={{ color: theme.palette.primary.main }}>
                      귀속: {Math.floor(calculateServerTotalReward(server).totalBoundGold).toLocaleString()}G
                    </span>
                  )}
                  {isServerExcluded && (
                    <span style={{ color: theme.palette.text.secondary }}>계산 제외됨</span>
                  )}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isServerExcluded}
                    onChange={() => onServerExcludeChange(server)}
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                  />
                }
                label="제외하기"
                sx={{ mr: 1 }}
                onClick={(e) => e.stopPropagation()}
              />
            </Box>
          </Box>

          {/* 2행: 거래 가능/귀속 (모바일 전용) */}
          {isMobile && (
            <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
              {!isServerExcluded && calculateServerTotalReward(server).totalTradableGold > 0 && (
                <span style={{ color: theme.palette.primary.main }}>
                  거래 가능: {Math.floor(calculateServerTotalReward(server).totalTradableGold).toLocaleString()}G
                </span>
              )}
              {!isServerExcluded && calculateServerTotalReward(server).totalTradableGold > 0 && calculateServerTotalReward(server).totalBoundGold > 0 && (
                <span style={{ marginLeft: '16px', color: theme.palette.primary.main }}>
                  귀속: {Math.floor(calculateServerTotalReward(server).totalBoundGold).toLocaleString()}G
                </span>
              )}
              {!isServerExcluded && calculateServerTotalReward(server).totalTradableGold === 0 && calculateServerTotalReward(server).totalBoundGold > 0 && (
                <span style={{ color: theme.palette.primary.main }}>
                  귀속: {Math.floor(calculateServerTotalReward(server).totalBoundGold).toLocaleString()}G
                </span>
              )}
              {isServerExcluded && (
                <span style={{ color: theme.palette.text.secondary }}>계산 제외됨</span>
              )}
            </Typography>
          )}
        </Box>
        <Collapse in={expanded} timeout={300}>
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: isMobile ? 0.5 : 2, 
              mt: 2 
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setIsHoveringCharacters(true)}
            onMouseLeave={() => setIsHoveringCharacters(false)}
          >
            {characters.map(character => (
              <Box key={character.characterName}>
                <ResultCharacterCard
                  character={character}
                  selectedRaids={selectedRaids[character.characterName] || []}
                  isGoldReward={goldRewardStates[character.characterName] || false}
                  isExcluded={excludeStates[character.characterName] || false}
                  onRaidCheck={(raidName) => onRaidCheck(character.characterName, raidName)}
                  onGoldRewardChange={() => onGoldRewardChange(character.characterName)}
                  onExcludeChange={() => onExcludeChange(character.characterName)}
                  priceMap={priceMap}
                  raids={getAvailableRaids(character.level)}
                  getSuitableChaosReward={getSuitableChaosReward}
                  getSuitableGuardianReward={getSuitableGuardianReward}
                  chaosOption={chaosOption}
                  guardianOption={guardianOption}
                  isExpanded={expandedCharacters[character.characterName] || false}
                  onToggle={() => onCharacterToggle(server, character.characterName)}
                />
              </Box>
            ))}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default ServerCard; 