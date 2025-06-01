import React, { useState, useEffect } from 'react';
import {Box, Typography, Tabs, Tab, OutlinedInput, InputAdornment, IconButton} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {useNavigate} from 'react-router-dom';
import {useTheme} from '@mui/material/styles';

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
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

    useEffect(() => {
        setLocalSearchQuery(searchQuery);
    }, [searchQuery]);

    const handleClearSearch = () => {
        setLocalSearchQuery('');
    };

    const handleSearch = () => {
        if (localSearchQuery) {
            navigate(`/result?name=${localSearchQuery}`);
        }
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '120px',
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
                    mb: 1.5
                }}>
                    <Tabs
                        value={tab}
                        onChange={(_, v) => onTabChange(_, v)}
                        sx={{
                            minHeight: '48px',
                            '& .MuiTabs-indicator': {
                                bottom: 0
                            }
                        }}
                    >
                        <Tab label="원정대"/>
                        <Tab label="자세히"/>
                        <Tab label="필터 및 도구"/>
                        <Tab label="시세 수정"/>
                    </Tabs>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                cursor: 'pointer'
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
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 1,
                    height: '48px'
                }}>
                    {totalTradableGold > 0 && (
                        <Typography variant="h6" sx={{ color: 'text.primary' }}>
                            거래 가능: <span style={{
                            color: theme.palette.primary.main,
                            fontWeight: 'bold'
                        }}>{Math.floor(totalTradableGold).toLocaleString()}G</span>
                        </Typography>
                    )}
                    {totalBoundGold > 0 && (
                        <Typography variant="h6" sx={{ color: 'text.primary' }}>
                            귀속: <span style={{
                            color: theme.palette.primary.main,
                            fontWeight: 'bold'
                        }}>{Math.floor(totalBoundGold).toLocaleString()}G</span>
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default SearchHeader; 