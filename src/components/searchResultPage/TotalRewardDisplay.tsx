import React, { useState } from 'react';
import { Box, Typography, Button, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import { renewExpeditionCharacters, SearchResponse } from '../../services/api';

interface TotalRewardDisplayProps {
    totalTradableGold: number;
    totalBoundGold: number;
    name: string;
    onRefresh: (data: SearchResponse) => void;
}

const TotalRewardDisplay: React.FC<TotalRewardDisplayProps> = ({ totalTradableGold, totalBoundGold, name, onRefresh }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width:800px)');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        try {
            setIsRefreshing(true);
            const response = await renewExpeditionCharacters(name);
            const searchResponse: SearchResponse = {
                expeditions: {
                    expeditions: response.expeditions
                },
                resources: [] // 갱신 API는 resources를 반환하지 않으므로 빈 배열로 설정
            };
            onRefresh(searchResponse);
        } catch (error) {
            console.error('원정대 캐릭터 정보 갱신 실패:', error);
            alert('원정대 캐릭터 정보 갱신에 실패했습니다.');
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            px: 1,
            height: '40px',
            my: 0.5
        }}>
            <Box sx={{ display: 'flex', gap: isMobile ? 2 : 4 }}>
                {totalTradableGold > 0 && (
                    <Typography variant={isMobile ? "body1" : "h6"} sx={{ color: 'text.primary' }}>
                        거래 가능: <span style={{
                            color: theme.palette.primary.main,
                            fontWeight: 'bold'
                        }}>{Math.floor(totalTradableGold).toLocaleString()}G</span>
                    </Typography>
                )}
                {totalBoundGold > 0 && (
                    <Typography variant={isMobile ? "body1" : "h6"} sx={{ color: 'text.primary' }}>
                        귀속: <span style={{
                            color: theme.palette.primary.main,
                            fontWeight: 'bold'
                        }}>{Math.floor(totalBoundGold).toLocaleString()}G</span>
                    </Typography>
                )}
            </Box>
            <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outlined"
                size="small"
                sx={{
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                    minWidth: '60px',
                    height: '32px',
                    '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        borderColor: theme.palette.primary.main
                    }
                }}
            >
                {isRefreshing ? (
                    <CircularProgress size={20} color="inherit" />
                ) : (
                    '갱신'
                )}
            </Button>
        </Box>
    );
};

export default TotalRewardDisplay; 