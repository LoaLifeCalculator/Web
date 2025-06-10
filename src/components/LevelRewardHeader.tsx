import React from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    currentTab: number;
    onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const LevelRewardHeader: React.FC<HeaderProps> = ({ currentTab, onTabChange }) => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 1200,
                backgroundColor: 'background.paper',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                pt: 2,
                pb: 0,
                px: { xs: 2, sm: 4 },
            }}
        >
            {/* Logo & Title */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    maxWidth: '1200px',
                    mx: 'auto',
                    mb: 0,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ height: { xs: 36, sm: 48 } }}>
                        <img
                            src="/images/mokoko/how_is_it_mokoko.png"
                            alt="검을 든 모코코"
                            style={{ 
                                height: '100%',
                                width: 'auto'
                            }}
                        />
                    </Box>
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            color: 'primary.main',
                            fontWeight: 'bold',
                            fontSize: { xs: '1.25rem', sm: '2rem' },
                        }}
                    >
                        레벨로 계산하기
                    </Typography>
                </Box>

                <Box
                    onClick={() => navigate('/')}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.8 },
                    }}
                >
                    <Box sx={{ height: { xs: 36, sm: 48 } }}>
                        <img
                            src="/images/mokoko/burp_mokoko.png"
                            alt="로생계산기"
                            style={{ 
                                height: '100%',
                                width: 'auto'
                            }}
                        />
                    </Box>
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            color: 'primary.main',
                            fontWeight: 'bold',
                            fontSize: { xs: '1.25rem', sm: '2rem' },
                        }}
                    >
                        로생 계산기
                    </Typography>
                </Box>
            </Box>

            {/* Tabs */}
            <Box sx={{ maxWidth: '1200px', mx: 'auto', borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={currentTab}
                    onChange={onTabChange}
                    sx={{
                        '& .MuiTab-root': {
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            minWidth: 100,
                            color: 'text.secondary',
                            '&.Mui-selected': { color: 'primary.main' },
                        },
                        '& .MuiTabs-indicator': { backgroundColor: 'primary.main' },
                    }}
                >
                    <Tab label="계산" />
                    <Tab label="결과" />
                    <Tab label="시세" />
                </Tabs>
            </Box>
        </Box>
    );
};

export default LevelRewardHeader;
