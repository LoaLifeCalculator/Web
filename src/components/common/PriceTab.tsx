import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Box, Typography, OutlinedInput, List, ListItem, Avatar, Card, CardContent, Button, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { ITEM_TRANSLATIONS } from '../../types';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface PriceTabProps {
  resources: { item: string; avgPrice: number }[];
  priceMap: Record<string, number>;
  onPriceChange: (item: string, value: number) => void;
  onClose: () => void;
}

interface ResourceItemProps {
  resource: { item: string; avgPrice: number };
  price: number;
  onPriceChange: (item: string, value: number) => void;
}

const ResourceItem = React.memo<ResourceItemProps>(({ resource, price, onPriceChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value.replace(/[^0-9.]/g, ''));
    onPriceChange(resource.item, isNaN(v) ? 0 : v);
  }, [resource.item, onPriceChange]);

  const handleReset = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onPriceChange(resource.item, 0);
  }, [resource.item, onPriceChange]);

  return (
    <ListItem 
      sx={{ 
        pl: 0, 
        pr: 0,
        mb: 1
      }}
    >
      <Card
        sx={{
          width: '100%',
          cursor: 'pointer'
        }}
        onClick={handleClick}
      >
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={`/images/items/${resource.item}.png`}
                alt={ITEM_TRANSLATIONS[resource.item] || resource.item}
                sx={{ width: 32, height: 32, mr: 2 }}
                variant="rounded"
              />
              <Typography>{ITEM_TRANSLATIONS[resource.item] || resource.item}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <OutlinedInput
                inputRef={inputRef}
                value={price ?? resource.avgPrice ?? ''}
                onChange={handleChange}
                sx={{ 
                  width: 120,
                  '& .MuiOutlinedInput-input': {
                    py: 0.5,
                    color: 'switch.main'
                  }
                }}
                inputProps={{ inputMode: 'decimal', pattern: '[0-9.]*' }}
                size="small"
              />
              <IconButton 
                size="small" 
                onClick={handleReset}
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main'
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </ListItem>
  );
});

ResourceItem.displayName = 'ResourceItem';

const ResourceList = React.memo<{ 
  resources: { item: string; avgPrice: number }[];
  priceMap: Record<string, number>;
  onPriceChange: (item: string, value: number) => void;
}>(({ resources, priceMap, onPriceChange }) => (
  <List dense>
    {resources.map((r) => (
      <ResourceItem
        key={r.item}
        resource={r}
        price={priceMap[r.item]}
        onPriceChange={onPriceChange}
      />
    ))}
  </List>
));

ResourceList.displayName = 'ResourceList';

const PriceTab = React.memo<PriceTabProps>(({ resources, priceMap, onPriceChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:800px)');
  const midPoint = Math.ceil(resources.length / 2);
  const leftResources = resources.slice(0, midPoint);
  const rightResources = resources.slice(midPoint);
  const [initialPrices, setInitialPrices] = useState<Record<string, number>>({});

  // 초기 시세 값 저장
  useEffect(() => {
    const initialPriceMap: Record<string, number> = {};
    resources.forEach(resource => {
      initialPriceMap[resource.item] = resource.avgPrice;
    });
    setInitialPrices(initialPriceMap);
  }, [resources]);

  const handlePriceChange = useCallback((item: string, value: number) => {
    onPriceChange(item, value);
  }, [onPriceChange]);

  const handleResetAll = useCallback(() => {
    Object.entries(initialPrices).forEach(([item, price]) => {
      onPriceChange(item, price);
    });
  }, [initialPrices, onPriceChange]);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={handleResetAll}
          sx={{
            color: 'text.secondary',
            borderColor: 'text.secondary',
            '&:hover': {
              borderColor: 'error.main',
              color: 'error.main',
            },
          }}
        >
          초기화
        </Button>
      </Box>
      {isMobile ? (
        <Box>
          <ResourceList 
            resources={resources} 
            priceMap={priceMap}
            onPriceChange={handlePriceChange}
          />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 6 }}>
          <Box sx={{ flex: 1 }}>
            <ResourceList 
              resources={leftResources} 
              priceMap={priceMap}
              onPriceChange={handlePriceChange}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <ResourceList 
              resources={rightResources} 
              priceMap={priceMap}
              onPriceChange={handlePriceChange}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
});

PriceTab.displayName = 'PriceTab';

export default PriceTab; 