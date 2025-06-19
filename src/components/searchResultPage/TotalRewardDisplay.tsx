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
            onRefresh(response);
        } catch (error) {
            console.error('데이터 갱신 중 오류 발생:', error);
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
            px: isMobile ? 0 : 1,
            height: '40px',
            my: isMobile ? 0 : 0.5,
            mt: isMobile ? 0.5 : 0
        }}>
            <Box sx={{ 
                display: 'flex', 
                gap: isMobile ? 0.5 : 2,
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center'
            }}>
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