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
    setTab: (value: number) => void;
    onHome: () => void;
    onRefresh: (data: any) => void;
}

const SearchResultHeader: React.FC<SearchHeaderProps> = ({
    searchQuery,
    setSearchQuery,
    totalTradableGold,
    totalBoundGold,
    tab,
    setTab,
    onHome,
    onRefresh
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
                py: 0.5,
                width: '100%'
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '48px',
                    mb: isMobile ? 0.5 : 1.5,
                    gap: 2,
                    width: '100%'
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
                        justifyContent: isMobile ? 'space-between' : 'flex-end',
                        width: isMobile ? '100%' : 'auto',
                        flexShrink: 0
                    }}>
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: 1,
                                flexShrink: 0,
                                cursor: 'pointer',
                                '&:hover': { opacity: 0.8 },
                            }}
                            onClick={onHome}
                        >
                            <img 
                                src="/images/mokoko/title_mokoko.png"
                                alt="로생계산기" 
                                style={{ 
                                    height: 35,
                                    width: 'auto'
                                }}
                            />
                        </Box>
                        <Box sx={{flex: 1, minWidth: 0}}>
                            <SearchInput
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                            />
                        </Box>
                    </Box>
                </Box>
                {isMobile && (
                    <Box sx={{ mb: 0.5 }}>
                        <NavigationTabs
                            tab={tab}
                            setTab={setTab}
                        />
                    </Box>
                )}
                <TotalRewardDisplay
                    totalTradableGold={totalTradableGold}
                    totalBoundGold={totalBoundGold}
                    name={searchQuery}
                    onRefresh={onRefresh}
                />
            </Box>
        </Box>
    );
};

export default SearchResultHeader;
