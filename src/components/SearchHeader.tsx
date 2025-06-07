import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import SearchInput from './SearchInput';
import TotalRewardDisplay from './TotalRewardDisplay';
import NavigationTabs from './NavigationTabs';

interface SearchHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    totalTradableGold: number;
    totalBoundGold: number;
    tab: number;
    setTab: (tab: number) => void;
    onHome: () => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
    searchQuery,
    setSearchQuery,
    totalTradableGold,
    totalBoundGold,
    tab,
    setTab,
    onHome
}) => {
    const isMobile = useMediaQuery('(max-width:800px)');

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
                pt: 2
            }}
        >
            <Box sx={{
                height: '100%',
                px: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '48px',
                    gap: 2
                }}>
                    {!isMobile && (
                        <NavigationTabs
                            tab={tab}
                            setTab={setTab}
                        />
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
                            onClick={onHome}
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
                        <SearchInput
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                    </Box>
                </Box>
                <Box>
                    {isMobile ? (
                        <NavigationTabs
                            tab={tab}
                            setTab={setTab}
                        />
                    ) : (
                        <TotalRewardDisplay
                            totalTradableGold={totalTradableGold}
                            totalBoundGold={totalBoundGold}
                            name={searchQuery}
                        />
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default SearchHeader; 