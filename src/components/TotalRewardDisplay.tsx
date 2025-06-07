import React, { useState } from 'react';
import { Box, Typography, IconButton, Fade, Paper, useTheme, useMediaQuery } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface TotalRewardDisplayProps {
    totalTradableGold: number;
    totalBoundGold: number;
}

const TotalRewardDisplay: React.FC<TotalRewardDisplayProps> = ({ totalTradableGold, totalBoundGold }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width:800px)');
    const [showTip, setShowTip] = useState(false);

    const handleTipClick = () => {
        setShowTip(true);
        setTimeout(() => {
            setShowTip(false);
        }, 5000);
    };

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            px: 1,
            height: '48px'
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
            <Box sx={{ position: 'relative' }}>
                <IconButton 
                    onClick={handleTipClick}
                    sx={{ 
                        color: theme.palette.primary.main,
                        '&:hover': {
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        },
                    }}
                >
                    <HelpOutlineIcon />
                </IconButton>
                <Fade in={showTip} timeout={300}>
                    <Paper
                        elevation={3}
                        sx={{
                            position: 'absolute',
                            right: 0,
                            top: '100%',
                            mt: 1,
                            p: 2,
                            backgroundColor: 'white',
                            borderRadius: 1,
                            zIndex: 1000,
                            maxWidth: isMobile ? '280px' : '500px',
                            width: 'max-content',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: -8,
                                right: 20,
                                width: 0,
                                height: 0,
                                borderLeft: '8px solid transparent',
                                borderRight: '8px solid transparent',
                                borderBottom: '8px solid white',
                            }
                        }}
                    >
                        <Typography variant="body2">
                            <Typography>
                                카드를 클릭하면 상세 정보를 확인할 수 있습니다.
                            </Typography>
                            <Typography>
                                도구 탭을 클릭하시면 다양한 설정을 적용할 수 있습니다.
                            </Typography>
                        </Typography>
                    </Paper>
                </Fade>
            </Box>
        </Box>
    );
};

export default TotalRewardDisplay; 