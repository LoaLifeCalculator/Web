import React from 'react';
import { Box, Typography, Button, ToggleButtonGroup, ToggleButton } from '@mui/material';

interface OptionSelectorProps {
    guardianOption: 'daily' | 'rest' | 'none';
    setGuardianOption: (opt: 'daily' | 'rest' | 'none') => void;
    chaosOption: 'daily' | 'rest' | 'none';
    setChaosOption: (opt: 'daily' | 'rest' | 'none') => void;
    isMobile: boolean;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
    guardianOption,
    setGuardianOption,
    chaosOption,
    setChaosOption,
    isMobile,
}) => (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
        <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                가디언 토벌
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                    variant={guardianOption === 'daily' ? 'contained' : 'outlined'}
                    onClick={() => setGuardianOption('daily')}
                    sx={{ flex: 1, backgroundColor: '#ffffff' }}
                >
                    매일
                </Button>
                <Button
                    variant={guardianOption === 'rest' ? 'contained' : 'outlined'}
                    onClick={() => setGuardianOption('rest')}
                    sx={{ flex: 1, backgroundColor: '#ffffff' }}
                >
                    휴게만
                </Button>
                <Button
                    variant={guardianOption === 'none' ? 'contained' : 'outlined'}
                    onClick={() => setGuardianOption('none')}
                    sx={{ flex: 1, backgroundColor: '#ffffff' }}
                >
                    계산 X
                </Button>
            </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                카오스 던전
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                    variant={chaosOption === 'daily' ? 'contained' : 'outlined'}
                    onClick={() => setChaosOption('daily')}
                    sx={{ flex: 1, backgroundColor: '#ffffff' }}
                >
                    매일
                </Button>
                <Button
                    variant={chaosOption === 'rest' ? 'contained' : 'outlined'}
                    onClick={() => setChaosOption('rest')}
                    sx={{ flex: 1, backgroundColor: '#ffffff' }}
                >
                    휴게만
                </Button>
                <Button
                    variant={chaosOption === 'none' ? 'contained' : 'outlined'}
                    onClick={() => setChaosOption('none')}
                    sx={{ flex: 1, backgroundColor: '#ffffff' }}
                >
                    계산 X
                </Button>
            </Box>
        </Box>
    </Box>
);

export default OptionSelector;
