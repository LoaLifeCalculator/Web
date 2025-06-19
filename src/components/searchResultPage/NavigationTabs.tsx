import React from 'react';
import { Tabs, Tab, Box, useMediaQuery } from '@mui/material';

interface NavigationTabsProps {
    tab: number;
    setTab: (value: number) => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ tab, setTab }) => {
    const isMobile = useMediaQuery('(max-width:800px)');

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    return (
        <Box sx={{
            minHeight: '48px',
            '& .MuiTabs-indicator': {
                bottom: 0
            },
            '& .MuiTab-root': {
                minWidth: isMobile ? '80px' : undefined,
                padding: isMobile ? '6px 12px' : undefined,
                fontSize: isMobile ? '0.875rem' : undefined
            }
        }}>
            <Tabs value={tab} onChange={handleTabChange}>
                <Tab label="원정대"/>
                <Tab label="자세히"/>
                <Tab label="도구"/>
                <Tab label="시세"/>
            </Tabs>
        </Box>
    );
};

export default NavigationTabs;
