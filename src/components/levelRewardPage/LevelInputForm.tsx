import React from 'react';
import { Box, TextField, Button, InputAdornment } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';

interface LevelInputFormProps {
    mainLevel: string;
    compareLevel: string;
    onMainLevelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCompareLevelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCalculate: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    isMobile: boolean;
}

const fieldStyles = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '28px',
        height: '64px',
        fontSize: '1.4rem',
        '& fieldset': { borderColor: 'rgba(0,0,0,0.23)' },
        '&:hover fieldset': { borderColor: 'primary.main' },
        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
    },
    '& .MuiInputLabel-root': {
        fontSize: '1rem',
        transform: 'translate(14px,20px) scale(1)',
        '&.Mui-focused, &.MuiFormLabel-filled': { transform: 'translate(14px,-9px) scale(0.75)' },
    },
    '& .MuiInputBase-input': {
        fontSize: '1.4rem',
    },
};

const LevelInputForm: React.FC<LevelInputFormProps> = ({
    mainLevel,
    compareLevel,
    onMainLevelChange,
    onCompareLevelChange,
    onCalculate,
    onKeyDown,
    isMobile,
}) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
                <TextField
                    label="계산할 레벨 (필수)"
                    value={mainLevel}
                    onChange={onMainLevelChange}
                    onKeyDown={onKeyDown}
                    fullWidth
                    type="number"
                    InputProps={{
                        endAdornment: <InputAdornment position="end">레벨</InputAdornment>,
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            height: isMobile ? '48px' : '56px',
                            fontSize: isMobile ? '1rem' : '1.1rem',
                            '& fieldset': { borderRadius: 2 },
                        },
                        '& .MuiInputLabel-root': {
                            fontSize: isMobile ? '0.9rem' : '1rem',
                        },
                    }}
                />
                <TextField
                    label="비교할 레벨"
                    value={compareLevel}
                    onChange={onCompareLevelChange}
                    onKeyDown={onKeyDown}
                    fullWidth
                    type="number"
                    InputProps={{
                        endAdornment: <InputAdornment position="end">레벨</InputAdornment>,
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            height: isMobile ? '48px' : '56px',
                            fontSize: isMobile ? '1rem' : '1.1rem',
                            '& fieldset': { borderRadius: 2 },
                        },
                        '& .MuiInputLabel-root': {
                            fontSize: isMobile ? '0.9rem' : '1rem',
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default LevelInputForm;
