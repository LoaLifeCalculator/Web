import React from 'react';
import { Box, Typography, OutlinedInput, Button, List, ListItem, Avatar } from '@mui/material';

interface PriceTabProps {
  resources: { item: string; avgPrice: number }[];
  priceMap: Record<string, number>;
  onPriceChange: (item: string, value: number) => void;
  onClose: () => void;
}

const PriceTab: React.FC<PriceTabProps> = ({ resources, priceMap, onPriceChange, onClose }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>시세 수정</Typography>
      <List dense>
        {resources.map((r) => (
          <ListItem key={r.item} sx={{ pl: 0, display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={`/images/items/${r.item}.png`}
              alt={r.item}
              sx={{ width: 32, height: 32, mr: 2 }}
              variant="rounded"
            />
            <Typography sx={{ minWidth: 120 }}>{r.item}</Typography>
            <OutlinedInput
              value={priceMap[r.item] ?? r.avgPrice ?? ''}
              onChange={e => {
                const v = Number(e.target.value.replace(/[^0-9.]/g, ''));
                onPriceChange(r.item, isNaN(v) ? 0 : v);
              }}
              sx={{ width: 120, ml: 2 }}
              inputProps={{ inputMode: 'decimal', pattern: '[0-9.]*' }}
            />
            <Typography sx={{ ml: 1 }}>G</Typography>
          </ListItem>
        ))}
      </List>
      <Button variant="outlined" color="primary" sx={{ mt: 4 }} onClick={onClose} fullWidth>
        닫기
      </Button>
    </Box>
  );
};

export default PriceTab; 