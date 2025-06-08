// File: src/components/RaidSelector.tsx

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { getAvailableRaids } from '../utils/rewardCalculator';

interface RaidSelectorProps {
    level: number;
    selectedRaids: string[];
    onToggleRaid: (raidName: string) => void;
}

const RaidSelector: React.FC<RaidSelectorProps> = ({
                                                       level,
                                                       selectedRaids,
                                                       onToggleRaid,
                                                   }) => {
    const raids = getAvailableRaids(level);

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                레이드 선택
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                {raids.map((raid) => (
                    <Button
                        key={raid.name}
                        variant={selectedRaids.includes(raid.name) ? 'contained' : 'outlined'}
                        onClick={() => onToggleRaid(raid.name)}
                        fullWidth
                        sx={{
                            height: { xs: '36px', sm: '48px' },
                            backgroundColor: '#ffffff',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: { xs: '0.75rem', sm: '1rem' },
                            fontWeight: 'bold',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            },
                        }}
                    >
                        {raid.name}
                    </Button>
                ))}
            </Box>
        </Box>
    );
};

export default RaidSelector;
