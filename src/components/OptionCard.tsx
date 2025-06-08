import React, { useState } from 'react';
import { Card, CardContent, Box, Typography, IconButton, Collapse, Button, CardHeader } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import LevelInputForm from './LevelInputForm';
import OptionSelector from './OptionSelector';
import RaidSelector from './RaidSelector';

interface OptionCardProps {
    mainLevel: string;
    compareLevel: string;
    onMainLevelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCompareLevelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCalculate: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    guardianOption: 'daily' | 'rest' | 'none';
    onGuardianOptionChange: (value: 'daily' | 'rest' | 'none') => void;
    chaosOption: 'daily' | 'rest' | 'none';
    onChaosOptionChange: (value: 'daily' | 'rest' | 'none') => void;
    selectedRaids: string[];
    onRaidToggle: (name: string) => void;
    calculatedMainLevel: number | null;
}

const OptionCard: React.FC<OptionCardProps> = ({
    mainLevel,
    compareLevel,
    onMainLevelChange,
    onCompareLevelChange,
    onCalculate,
    onKeyDown,
    guardianOption,
    onGuardianOptionChange,
    chaosOption,
    onChaosOptionChange,
    selectedRaids,
    onRaidToggle,
    calculatedMainLevel,
}) => {
    const [open, setOpen] = useState(true);

    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <Card
            sx={{
                borderRadius: 2,
                backgroundColor: '#fafafa',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                mb: 2,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' },
            }}
        >
            <CardHeader
                title="옵션 설정"
                action={
                    <IconButton onClick={handleToggle}>
                        <ExpandLess
                            sx={{
                                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s'
                            }}
                        />
                    </IconButton>
                }
                onClick={handleToggle}
                sx={{ cursor: 'pointer' }}
            />
            <Collapse in={open} timeout={300}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <LevelInputForm
                            mainLevel={mainLevel}
                            compareLevel={compareLevel}
                            onMainLevelChange={onMainLevelChange}
                            onCompareLevelChange={onCompareLevelChange}
                            onCalculate={onCalculate}
                            onKeyDown={onKeyDown}
                        />
                        <OptionSelector
                            guardianOption={guardianOption}
                            setGuardianOption={onGuardianOptionChange}
                            chaosOption={chaosOption}
                            setChaosOption={onChaosOptionChange}
                        />
                        {calculatedMainLevel !== null && (
                            <RaidSelector
                                level={calculatedMainLevel}
                                selectedRaids={selectedRaids}
                                onToggleRaid={onRaidToggle}
                            />
                        )}
                    </Box>
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default OptionCard; 