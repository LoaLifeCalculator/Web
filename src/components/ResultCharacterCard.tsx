import React from 'react';
import { Box, Typography, FormControlLabel, Switch, Checkbox } from '@mui/material';
import { Character } from '../services/api';

interface ResultCharacterCardProps {
  character: Character;
  priceMap: Record<string, number>;
  raids: any[];
  selectedRaids: string[];
  isGoldReward: boolean;
  isExcluded: boolean;
  onGoldRewardChange: (characterName: string) => void;
  onExcludeChange: (characterName: string) => void;
  onRaidCheck: (characterName: string, raidName: string) => void;
  getSuitableChaosReward: (level: number) => any;
  getSuitableGuardianReward: (level: number) => any;
  calcTradableGold: (reward: any, priceMap: Record<string, number>, isRest?: boolean) => number;
  calcBoundGold: (reward: any, priceMap: Record<string, number>, isRest?: boolean) => number;
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
  calcTradableGold,
  calcBoundGold,
}) => {
  const chaosReward = getSuitableChaosReward(character.level);
  const chaosTradable = chaosReward ? calcTradableGold(chaosReward, priceMap) : 0;
  const chaosBound = chaosReward ? calcBoundGold(chaosReward, priceMap) : 0;
  const guardianReward = getSuitableGuardianReward(character.level);
  const guardianTradable = guardianReward ? calcTradableGold(guardianReward, priceMap) : 0;
  const guardianBound = guardianReward ? calcBoundGold(guardianReward, priceMap) : 0;
  const checkedRaids = raids.filter((r: any) => (selectedRaids || []).includes(r.name));
  const raidTradable = checkedRaids.reduce((sum, raid) =>
    sum + calcTradableGold(isGoldReward ? raid.goldReward : raid.nonGoldReward, priceMap), 0);
  const raidBound = checkedRaids.reduce((sum, raid) =>
    sum + calcBoundGold(isGoldReward ? raid.goldReward : raid.nonGoldReward, priceMap), 0);
  const totalCharacterTradable = chaosTradable + guardianTradable + raidTradable;
  const totalCharacterBound = chaosBound + guardianBound + raidBound;

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
        opacity: isExcluded ? 0.5 : 1,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1">{character.characterName}</Typography>
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={isGoldReward}
                onChange={() => onGoldRewardChange(character.characterName)}
                color="primary"
              />
            }
            label="골드 획득"
          />
          <FormControlLabel
            control={
              <Switch
                checked={isExcluded}
                onChange={() => onExcludeChange(character.characterName)}
                color="secondary"
              />
            }
            label="계산 제외"
          />
        </Box>
      </Box>
      {/* 캐릭터별 총 보상 */}
      <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>총 보상</Typography>
        <Typography color="primary">거래 가능 골드: {totalCharacterTradable.toLocaleString()} G</Typography>
        <Typography color="primary">귀속 골드: {totalCharacterBound.toLocaleString()} G</Typography>
      </Box>
      <Typography>레벨: {character.level}</Typography>
      <Typography>직업: {character.className}</Typography>
      {/* 카던 보상 */}
      <Box sx={{ mt: 2, mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>카던 보상</Typography>
        <Typography color="primary">거래 가능 골드: {chaosTradable.toLocaleString()} G</Typography>
        <Typography color="primary">귀속 골드: {chaosBound.toLocaleString()} G</Typography>
      </Box>
      {/* 가토 보상 */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>가토 보상</Typography>
        <Typography color="primary">거래 가능 골드: {guardianTradable.toLocaleString()} G</Typography>
        <Typography color="primary">귀속 골드: {guardianBound.toLocaleString()} G</Typography>
      </Box>
      {/* 레이드 보상 */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>레이드 보상</Typography>
        <Typography color="secondary">거래 가능 골드: {raidTradable.toLocaleString()} G</Typography>
        <Typography color="secondary">귀속 골드: {raidBound.toLocaleString()} G</Typography>
      </Box>
      {/* 레이드별 체크박스 */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>입장 가능 레이드</Typography>
        {raids.map((raid: any, rIdx: number) => (
          <FormControlLabel
            key={rIdx}
            control={
              <Checkbox
                checked={(selectedRaids || []).includes(raid.name)}
                onChange={() => onRaidCheck(character.characterName, raid.name)}
                disabled={isExcluded}
              />
            }
            label={`${raid.name} (${raid.minLevel}레벨)`}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ResultCharacterCard; 