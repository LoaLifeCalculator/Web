// File: src/components/RewardCard.tsx

import React, {useState} from 'react';
import {Card, CardContent, Box, Typography, IconButton, Collapse} from '@mui/material';
import {ExpandLess, ExpandMore} from '@mui/icons-material';
import ResourceRewards from './ResourceRewards';
import {useTheme} from '@mui/material/styles';

interface RewardCardProps {
    title: string;
    imageUrl: string;
    tradableGold: number;
    boundGold: number;
    tradableRewards: Record<string, { count: number; goldValue: number }>;
    boundRewards: Record<string, { count: number; goldValue: number }>;
    isExpanded: boolean;
    onToggle: () => void;
}

const RewardCard: React.FC<RewardCardProps> = (
    {
        title,
        imageUrl,
        tradableGold,
        boundGold,
        tradableRewards,
        boundRewards,
        isExpanded,
        onToggle
    }
) => {
    const theme = useTheme();
    const [open, setOpen] = useState(true);

    return (
        <Card
            sx={{
                borderRadius: 2,
                backgroundColor: '#fafafa',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                mb: 2,
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover': {transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)'},
            }}
            onClick={onToggle}
        >
            <CardContent sx={{p: 2}}>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 0}}>
                    <Box
                        sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                            <Box
                                component="img"
                                src={imageUrl}
                                alt="보상 이미지"
                                sx={{
                                    width: '45px',
                                    height: 'auto',
                                    objectFit: 'contain'
                                }}
                            />
                            <Typography variant="h6" sx={{fontWeight: 'bold', color: 'primary.main'}}>
                                {title}
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            sx={{transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s'}}
                        >
                            {isExpanded ? <ExpandLess/> : <ExpandLess/>}
                        </IconButton>
                    </Box>
                    <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                        {tradableGold > 0 && (
                            <Typography>
                                거래 가능:{' '}
                                <span style={{color: theme.palette.primary.main, fontWeight: 'bold'}}>
                                    {Math.floor(tradableGold).toLocaleString()}G
                                </span>
                            </Typography>
                        )}
                        {boundGold > 0 && (
                            <Typography>
                                귀속:{' '}
                                <span style={{color: theme.palette.primary.main, fontWeight: 'bold'}}>
                                    {Math.floor(boundGold).toLocaleString()}G
                                </span>
                            </Typography>
                        )}
                    </Box>
                    <Collapse in={isExpanded} timeout={300}>
                        <Box sx={{mt: 1}}>
                            <ResourceRewards tradableRewards={tradableRewards} boundRewards={boundRewards}/>
                        </Box>
                    </Collapse>
                </Box>
            </CardContent>
        </Card>
    );
};

export default RewardCard;
