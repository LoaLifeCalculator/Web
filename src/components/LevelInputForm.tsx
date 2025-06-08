import React from 'react';
import { Box, TextField, Button } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';

interface LevelInputFormProps {
    mainLevel: string;
    compareLevel: string;
    onMainLevelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCompareLevelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCalculate: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
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
                                                       }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <TextField
                label="계산할 레벨"
                type="number"
                value={mainLevel}
                onChange={onMainLevelChange}
                onKeyDown={onKeyDown}
                fullWidth
                sx={{
                    flex: { md: 1 },
                    '& input[type=number]::-webkit-outer-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,
                    },
                    '& input[type=number]::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,
                    },
                    '& input[type=number]': {
                        MozAppearance: 'textfield',
                    },
                }}
            />
            <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' }, flex: { md: 1 } }}>
                <TextField
                    label="비교할 레벨"
                    type="number"
                    value={compareLevel}
                    onChange={onCompareLevelChange}
                    onKeyDown={onKeyDown}
                    fullWidth
                    sx={{
                        '& input[type=number]::-webkit-outer-spin-button': {
                            WebkitAppearance: 'none',
                            margin: 0,
                        },
                        '& input[type=number]::-webkit-inner-spin-button': {
                            WebkitAppearance: 'none',
                            margin: 0,
                        },
                        '& input[type=number]': {
                            MozAppearance: 'textfield',
                        },
                    }}
                />
                <Button
                    variant="contained"
                    onClick={onCalculate}
                    sx={{
                        height: { xs: '56px', sm: '56px' },
                        minHeight: { xs: '56px', sm: '56px' },
                        lineHeight: '56px',
                        padding: 0,
                        minWidth: { xs: '80px', sm: '100px' },
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                >
                    계산
                </Button>
            </Box>
        </Box>
    );
};

export default LevelInputForm;
