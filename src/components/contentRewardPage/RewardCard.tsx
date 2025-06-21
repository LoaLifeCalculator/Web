import React from 'react';
import { Card, CardContent, Typography, Box, Collapse, Avatar } from '@mui/material';
import { Reward } from '../../utils/rewardCalculator';

interface RewardCardProps {
    title: string;
    goldValue: number;
    reward: Reward;
    nonGoldReward?: Reward;
    isExpanded: boolean;
    onToggle: () => void;
    formatReward: (reward: Reward) => { name: string; count: number; image: string; goldValue?: number }[];
}

const RewardCard: React.FC<RewardCardProps> = ({
    title,
    goldValue,
    reward,
    nonGoldReward,
    isExpanded,
    onToggle,
    formatReward
}) => {
    return (
        <Card
            elevation={2}
            sx={{
                backgroundColor: 'background.paper',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    elevation: 4,
                },
            }}
            onClick={onToggle}
        >
            <CardContent sx={{ py: 1.1, px: 1.7, paddingBottom: '0.8rem !important' }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}>
                    <Typography variant="h6" sx={{color: 'text.primary'}}>
                        {title}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: 'primary.main',
                            fontWeight: 'bold'
                        }}
                    >
                        총 골드 가치: {Math.floor(goldValue).toLocaleString()}G
                    </Typography>
                </Box>
                <Collapse in={isExpanded} timeout={300}>
                    <Box sx={{mt: 1}}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 'bold',
                                mb: 0.5
                            }}
                        >
                            기본 보상
                        </Typography>
                        {formatReward(reward).map((detail, detailIndex) => (
                            <Box
                                key={detailIndex}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 0.5
                                }}
                            >
                                <Avatar
                                    src={detail.image}
                                    alt={detail.name}
                                    sx={{width: 24, height: 24, mr: 1}}
                                    variant="rounded"
                                />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {detail.name}: {detail.count.toLocaleString()}
                                    {detail.goldValue !== undefined && (
                                        <span style={{
                                            color: 'primary.main',
                                            marginLeft: '4px'
                                        }}>
                                            ({Math.floor(detail.goldValue).toLocaleString()}G)
                                        </span>
                                    )}
                                </Typography>
                            </Box>
                        ))}
                        {nonGoldReward && (
                            <>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        color: 'primary.main',
                                        fontWeight: 'bold',
                                        mt: 1,
                                        mb: 0.5
                                    }}
                                >
                                    더보기할 경우 재화 수급량
                                </Typography>
                                {formatReward(nonGoldReward).map((detail, detailIndex) => (
                                    <Box
                                        key={detailIndex}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 0.5
                                        }}
                                    >
                                        <Avatar
                                            src={detail.image}
                                            alt={detail.name}
                                            sx={{width: 24, height: 24, mr: 1}}
                                            variant="rounded"
                                        />
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {detail.name}: {detail.count.toLocaleString()}
                                            {detail.goldValue !== undefined && (
                                                <span style={{
                                                    color: 'primary.main',
                                                    marginLeft: '4px'
                                                }}>
                                                    ({Math.floor(detail.goldValue).toLocaleString()}G)
                                                </span>
                                            )}
                                        </Typography>
                                    </Box>
                                ))}
                            </>
                        )}
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    );
};

export default RewardCard; 