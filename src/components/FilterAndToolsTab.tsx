import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Radio, RadioGroup, Button, OutlinedInput, List, ListItem } from '@mui/material';

interface FilterAndToolsTabProps {
  showTradableOnly: boolean;
  onShowTradableOnlyChange: (checked: boolean) => void;
  chaosOption: number;
  onChaosOptionChange: (value: number) => void;
  guardianOption: number;
  onGuardianOptionChange: (value: number) => void;
  batchExcludeLevel: string;
  onBatchExcludeLevelChange: (value: string) => void;
  onBatchExcludeByLevel: (level: number) => void;
  sortedServers: string[];
  disabledServers: string[];
  onDisabledServerChange: (server: string, checked: boolean) => void;
  onClose: () => void;
}

const FilterAndToolsTab: React.FC<FilterAndToolsTabProps> = ({
  showTradableOnly,
  onShowTradableOnlyChange,
  chaosOption,
  onChaosOptionChange,
  guardianOption,
  onGuardianOptionChange,
  batchExcludeLevel,
  onBatchExcludeLevelChange,
  onBatchExcludeByLevel,
  sortedServers,
  disabledServers,
  onDisabledServerChange,
  onClose,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <FormControlLabel
        control={<Checkbox checked={showTradableOnly} onChange={e => onShowTradableOnlyChange(e.target.checked)} />}
        label="거래 가능만 보기"
      />
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1">카오스 던전</Typography>
        <RadioGroup row value={chaosOption} onChange={e => onChaosOptionChange(Number(e.target.value))}>
          <FormControlLabel value={0} control={<Radio />} label="매일" />
          <FormControlLabel value={1} control={<Radio />} label="휴게만" />
          <FormControlLabel value={2} control={<Radio />} label="계산 X" />
        </RadioGroup>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1">가디언 토벌</Typography>
        <RadioGroup row value={guardianOption} onChange={e => onGuardianOptionChange(Number(e.target.value))}>
          <FormControlLabel value={0} control={<Radio />} label="매일" />
          <FormControlLabel value={1} control={<Radio />} label="휴게만" />
          <FormControlLabel value={2} control={<Radio />} label="계산 X" />
        </RadioGroup>
      </Box>
      <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
        <OutlinedInput
          value={batchExcludeLevel}
          onChange={e => onBatchExcludeLevelChange(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="해당 레벨 미만 캐릭터 전체 제외"
          sx={{ width: 200, mr: 2 }}
        />
        <Button
          variant="contained"
          onClick={() => batchExcludeLevel && onBatchExcludeByLevel(Number(batchExcludeLevel))}
          disabled={!batchExcludeLevel}
        >
          일괄 제외
        </Button>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1">서버 비활성화</Typography>
        <List dense>
          {sortedServers.map(server => (
            <ListItem key={server} sx={{ pl: 0 }}>
              <FormControlLabel
                control={<Checkbox checked={disabledServers.includes(server)} onChange={e => onDisabledServerChange(server, e.target.checked)} />}
                label={server}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Button variant="outlined" color="primary" sx={{ mt: 4 }} onClick={onClose} fullWidth>
        닫기
      </Button>
    </Box>
  );
};

export default FilterAndToolsTab; 