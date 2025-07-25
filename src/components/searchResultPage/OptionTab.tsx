import React, { useState, useRef } from 'react';
import { Box, Typography, FormControlLabel, Radio, RadioGroup, TextField, Button, Card, CardContent, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface FilterAndToolsTabProps {
  chaosOption: number;
  onChaosOptionChange: (value: number) => void;
  guardianOption: number;
  onGuardianOptionChange: (value: number) => void;
  batchExcludeLevel: string;
  onBatchExcludeLevelChange: (value: string) => void;
  onBatchExcludeByLevel: (level: number) => void;
  batchRaidLevel: string;
  onBatchRaidLevelChange: (value: string) => void;
  onBatchRaidByLevel: (level: number) => void;
}

const OptionTab: React.FC<FilterAndToolsTabProps> = ({
  chaosOption,
  onChaosOptionChange,
  guardianOption,
  onGuardianOptionChange,
  batchExcludeLevel,
  onBatchExcludeLevelChange,
  onBatchExcludeByLevel,
  batchRaidLevel,
  onBatchRaidLevelChange,
  onBatchRaidByLevel
}) => {
  const [excludeButtonVariant, setExcludeButtonVariant] = useState<'contained' | 'outlined'>('contained');
  const [raidButtonVariant, setRaidButtonVariant] = useState<'contained' | 'outlined'>('contained');
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:800px)');
  const excludeInputRef = useRef<HTMLInputElement>(null);
  const raidInputRef = useRef<HTMLInputElement>(null);

  const handleBatchExclude = () => {
    const level = parseInt(batchExcludeLevel);
    if (!isNaN(level)) {
      onBatchExcludeByLevel(level);
      setExcludeButtonVariant('outlined');
      setTimeout(() => setExcludeButtonVariant('contained'), 1000);
      onBatchExcludeLevelChange('');
    }
  };

  const handleBatchRaid = () => {
    const level = Number(batchRaidLevel);
    if (!isNaN(level)) {
      onBatchRaidByLevel(level);
      setRaidButtonVariant('outlined');
      setTimeout(() => setRaidButtonVariant('contained'), 1000);
      onBatchRaidLevelChange('');
    }
  };

  return (
    <Box sx={{ py: 3, px: 0 }}>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: 2 
      }}>
        {/* 카오스 던전 */}
        <Card sx={{ p: 0.5, pb: 0 }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>
              카오스 던전 보상 계산
            </Typography>
            <RadioGroup
              row
              value={chaosOption}
              onChange={(e) => onChaosOptionChange(Number(e.target.value))}
              sx={{ gap: 2, pl: 1 }}
            >
              <FormControlLabel 
                value={0} 
                control={<Radio size="small" sx={{ p: 0.5 }} />} 
                label="매일" 
              />
              <FormControlLabel 
                value={1} 
                control={<Radio size="small" sx={{ p: 0.5 }} />} 
                label="휴게만" 
              />
              <FormControlLabel 
                value={2} 
                control={<Radio size="small" sx={{ p: 0.5 }} />} 
                label="계산 X" 
              />
            </RadioGroup>
          </CardContent>
        </Card>

        {/* 가디언 토벌 */}
        <Card sx={{ p: 0.5, pb: 0 }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>
              가디언 토벌 보상 계산
            </Typography>
            <RadioGroup
              row
              value={guardianOption}
              onChange={(e) => onGuardianOptionChange(Number(e.target.value))}
              sx={{ gap: 2, pl: 1 }}
            >
              <FormControlLabel 
                value={0} 
                control={<Radio size="small" sx={{ p: 0.5 }} />} 
                label="매일" 
              />
              <FormControlLabel 
                value={1} 
                control={<Radio size="small" sx={{ p: 0.5 }} />} 
                label="휴게만" 
              />
              <FormControlLabel 
                value={2} 
                control={<Radio size="small" sx={{ p: 0.5 }} />} 
                label="계산 X" 
              />
            </RadioGroup>
          </CardContent>
        </Card>

        {/* 일괄 제외 */}
        <Card 
          sx={{ cursor: 'pointer', p: 0.5, pb: 0 }}
          onClick={() => excludeInputRef.current?.focus()}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: 'primary.main' }}>
              일정 레벨 이상 캐릭터만 계산
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              해당 레벨 이상의 캐릭터를 계산에 포함하고, 나머지 캐릭터는 제외합니다.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                inputRef={excludeInputRef}
                size="small"
                value={batchExcludeLevel}
                onChange={(e) => onBatchExcludeLevelChange(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleBatchExclude();
                  }
                }}
                placeholder="레벨 입력"
                type="number"
                sx={{ width: 200 }}
              />
              <Button
                variant={excludeButtonVariant}
                onClick={handleBatchExclude}
                sx={{
                  '&.MuiButton-contained': {
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                적용
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* 일괄 레이드 입장 기능 */}
        <Card 
          sx={{ cursor: 'pointer', p: 0.5, pb: 0  }}
          onClick={() => raidInputRef.current?.focus()}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: 'primary.main' }}>
              일정 레벨 이상 캐릭터 레이드 입장
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              해당 레벨 이상의 캐릭터의 레이드 항목을 체크하고, 나머지 캐릭터는 체크 해제합니다.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                inputRef={raidInputRef}
                size="small"
                value={batchRaidLevel}
                onChange={(e) => onBatchRaidLevelChange(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleBatchRaid();
                  }
                }}
                placeholder="레벨 입력"
                type="number"
                sx={{ width: 200 }}
              />
              <Button
                variant={raidButtonVariant}
                onClick={handleBatchRaid}
                sx={{
                  '&.MuiButton-contained': {
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                적용
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default OptionTab;