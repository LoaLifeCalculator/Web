// File: src/components/ResourceRewards.tsx

import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ITEM_TRANSLATIONS } from '../../types';

interface ResourceRewardsProps {
    tradableRewards: Record<string, { count: number; goldValue: number }>;
    boundRewards: Record<string, { count: number; goldValue: number }>;
}

const ResourceRewards: React.FC<ResourceRewardsProps> = ({
                                                             tradableRewards,
                                                             boundRewards,
                                                         }) => {
    const theme = useTheme();

    const renderSection = (
        rewards: Record<string, { count: number; goldValue: number }>,
        title: string
    ) => {
        const entries = Object.entries(rewards).sort(([a], [b]) => {
            if (a === 'GOLD') return -1;
            if (b === 'GOLD') return 1;
            return rewards[b].goldValue - rewards[a].goldValue;
        });

        return (
            <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                    {title}
                </Typography>
                {entries.map(([resource, { count, goldValue }]) => (
                    <Box
                        key={resource}
                        sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                    >
                        <Avatar
                            src={`/images/items/${resource}.png`}
                            alt={resource === 'GOLD' ? '골드' : ITEM_TRANSLATIONS[resource] || resource}
                            variant="rounded"
                            sx={{ width: 24, height: 24, mr: 1 }}
                        />
                        <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{
                                fontWeight: resource === 'GOLD' ? 'bold' : 'normal',
                                '& > span': {
                                    color: resource === 'GOLD' ? theme.palette.primary.main : 'inherit',
                                },
                            }}
                        >
                            {resource === 'GOLD' ? '골드' : ITEM_TRANSLATIONS[resource] || resource}: <span>{Math.floor(count).toLocaleString()}</span>
                            {resource !== 'GOLD' && (
                                <span style={{ color: theme.palette.primary.main, marginLeft: 4 }}>
                  {Math.floor(goldValue).toLocaleString()}G
                </span>
                            )}
                        </Typography>
                    </Box>
                ))}
            </Box>
        );
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Object.keys(tradableRewards).length > 0 &&
                renderSection(tradableRewards, '거래 가능 재화')}
            {Object.keys(boundRewards).length > 0 &&
                renderSection(boundRewards, '귀속 재화')}
        </Box>
    );
};

export default ResourceRewards;
