// File: src/components/RaidSelector.tsx

import React from 'react';
import { Box, Typography, Button, FormControlLabel, Checkbox } from '@mui/material';
import { getAvailableRaids } from '../utils/rewardCalculator';

interface RaidSelectorProps {
    level: number;
    selectedRaids: string[];
    onToggleRaid: (raidName: string) => void;
    isMobile: boolean;
}

const RaidSelector: React.FC<RaidSelectorProps> = ({
                                                       level,
                                                       selectedRaids,
                                                       onToggleRaid,
                                                       isMobile,
                                                   }) => {
    const raids = getAvailableRaids(level);

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                레이드 선택
            </Typography>
            {raids.length > 0 ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                    {raids.map((raid) => (
                        <Button
                            key={raid.name}
                            variant={selectedRaids.includes(raid.name) ? 'contained' : 'outlined'}
                            onClick={() => onToggleRaid(raid.name)}
                            fullWidth
                            sx={{
                                height: isMobile ? '36px' : '48px',
                                backgroundColor: '#ffffff',
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: isMobile ? '0.75rem' : '1rem',
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
            ) : (
                <Typography 
                    variant="body1" 
                    sx={{ 
                        color: 'text.secondary',
                        textAlign: 'center',
                        py: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        borderRadius: 1
                    }}
                >
                    입장 가능한 레이드가 존재하지 않습니다
                </Typography>
            )}
        </Box>
    );
};

export default RaidSelector;
