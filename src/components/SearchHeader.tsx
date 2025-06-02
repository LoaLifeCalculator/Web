import React, { useState, useEffect } from 'react';
import {Box, Typography, Tabs, Tab, OutlinedInput, InputAdornment, IconButton, Fade, Paper, useTheme, useMediaQuery} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {useNavigate} from 'react-router-dom';

interface SearchHeaderProps {
    tab: number;
    onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    totalTradableGold: number;
    totalBoundGold: number;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
    tab,
    onTabChange,
    searchQuery,
    setSearchQuery,
    totalTradableGold,
    totalBoundGold
}) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width:800px)');
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
    const [showTip, setShowTip] = useState(false);

    useEffect(() => {
        setLocalSearchQuery(searchQuery);
    }, [searchQuery]);

    const handleSearch = () => {
        if (localSearchQuery.trim()) {
            setSearchQuery(localSearchQuery);
            window.dispatchEvent(new CustomEvent('searchQueryChanged', { 
                detail: { query: localSearchQuery }
            }));
        }
    };

    const handleClearSearch = () => {
        setLocalSearchQuery('');
    };

    const handleTipClick = () => {
        setShowTip(true);
        setTimeout(() => {
            setShowTip(false);
        }, 5000);
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: isMobile ? '180px' : '120px',
                zIndex: 1000,
                backgroundColor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider',
                boxShadow: 1,
                pt: 1,
                pb: 1
            }}
        >
            <Box sx={{
                height: '100%',
                px: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                py: 1
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '48px',
                    mb: isMobile ? 1 : 1.5,
                    gap: 2
                }}>
                    {!isMobile && (
                        <Tabs
                            value={tab}
                            onChange={(_, v) => onTabChange(_, v)}
                            sx={{
                                minHeight: '48px',
                                flex: 1,
                                '& .MuiTabs-indicator': {
                                    bottom: 0
                                },
                                '& .MuiTab-root': {
                                    minWidth: '80px',
                                    padding: '6px 16px'
                                }
                            }}
                        >
                            <Tab label="원정대"/>
                            <Tab label="자세히"/>
                            <Tab label="도구"/>
                            <Tab label="시세 수정"/>
                        </Tabs>
                    )}
                    <Box sx={{
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        width: isMobile ? '100%' : 'auto',
                        justifyContent: isMobile ? 'space-between' : 'flex-end',
                        flexShrink: 0
                    }}>
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                cursor: 'pointer',
                                flexShrink: 0
                            }}
                            onClick={() => navigate('/')}
                        >
                            <img 
                                src="/images/common/calculate_mokoko.png" 
                                alt="로생계산기" 
                                style={{ 
                                    height: 32,
                                    width: 'auto'
                                }}
                            />
                            <Typography
                                variant="h5"
                                component="div"
                                sx={{whiteSpace: 'nowrap'}}
                            >
                                로생계산기
                            </Typography>
                        </Box>
                        <OutlinedInput
                            placeholder="캐릭터명 검색"
                            value={localSearchQuery}
                            onChange={(e) => setLocalSearchQuery(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                            endAdornment={
                                <InputAdornment position="end" sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton
                                        edge="end"
                                        onClick={handleClearSearch}
                                        sx={{ 
                                            visibility: localSearchQuery ? 'visible' : 'hidden',
                                            '&:hover': {
                                                color: theme.palette.primary.main
                                            }
                                        }}
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                    <SearchIcon 
                                        color="action" 
                                        sx={{ cursor: 'pointer' }}
                                        onClick={handleSearch}
                                    />
                                </InputAdornment>
                            }
                            sx={{
                                minWidth: 200,
                                maxWidth: 275,
                                flexGrow: 1,
                                width: '100%',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'divider'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main'
                                }
                            }}
                        />
                    </Box>
                </Box>
                {isMobile && (
                    <Box sx={{ mb: 1 }}>
                        <Tabs
                            value={tab}
                            onChange={(_, v) => onTabChange(_, v)}
                            sx={{
                                minHeight: '48px',
                                '& .MuiTabs-indicator': {
                                    bottom: 0
                                },
                                '& .MuiTab-root': {
                                    minWidth: '80px',
                                    padding: '6px 16px'
                                }
                            }}
                        >
                            <Tab label="원정대"/>
                            <Tab label="자세히"/>
                            <Tab label="도구"/>
                            <Tab label="시세 수정"/>
                        </Tabs>
                    </Box>
                )}
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
                                    minWidth: 400,
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
            </Box>
        </Box>
    );
};

export default SearchHeader; 