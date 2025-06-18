import React, { useState, useEffect, useRef } from 'react';
import { OutlinedInput, InputAdornment, IconButton, useTheme, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import { getSearchHistory, addToSearchHistory, removeFromSearchHistory } from '../../utils/cookieManager';

interface SearchInputProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ searchQuery, setSearchQuery }) => {
    const theme = useTheme();
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
    const [isFocused, setIsFocused] = useState(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLocalSearchQuery(searchQuery);
    }, [searchQuery]);

    const handleSearch = () => {
        if (localSearchQuery.trim()) {
            setSearchQuery(localSearchQuery);
            addToSearchHistory(localSearchQuery.trim());
            setSearchHistory(getSearchHistory());
            window.dispatchEvent(new CustomEvent('searchQueryChanged', { 
                detail: { query: localSearchQuery }
            }));
        }
    };

    const handleClearSearch = () => {
        setLocalSearchQuery('');
    };

    const handleHistoryClick = (historyNickname: string) => {
        setLocalSearchQuery(historyNickname);
        setSearchQuery(historyNickname);
        addToSearchHistory(historyNickname);
        setSearchHistory(getSearchHistory());
        window.dispatchEvent(new CustomEvent('searchQueryChanged', { 
            detail: { query: historyNickname }
        }));
    };

    const handleRemoveHistory = (e: React.MouseEvent, historyNickname: string) => {
        e.stopPropagation();
        removeFromSearchHistory(historyNickname);
        setSearchHistory(getSearchHistory());
        setIsFocused(true);
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 0);
    };

    return (
        <Box sx={{ position: 'relative', width: '100%' }}>
            <OutlinedInput
                inputRef={searchInputRef}
                placeholder="캐릭터명 검색"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                onFocus={() => {
                    setIsFocused(true);
                    setSearchHistory(getSearchHistory());
                }}
                onBlur={(e) => {
                    if (e.relatedTarget?.closest('.MuiIconButton-root')) {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsFocused(true);
                        setTimeout(() => {
                            searchInputRef.current?.focus();
                        }, 0);
                        return;
                    }
                    setTimeout(() => setIsFocused(false), 200);
                }}
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
            
            {/* 검색 기록 드롭다운 */}
            {isFocused && searchHistory.length > 0 && (
                <Paper
                    elevation={3}
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        mt: 1,
                        zIndex: 1000,
                        maxHeight: '300px',
                        overflowY: 'auto'
                    }}
                >
                    <List>
                        {searchHistory.map((historyNickname, index) => (
                            <ListItem
                                key={index}
                                onClick={() => handleHistoryClick(historyNickname)}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                    }
                                }}
                            >
                                <ListItemText 
                                    primary={historyNickname}
                                    primaryTypographyProps={{
                                        sx: {
                                            fontSize: '1rem',
                                            color: 'text.primary'
                                        }
                                    }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={(e) => handleRemoveHistory(e, historyNickname)}
                                    sx={{
                                        padding: '4px',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.08)'
                                        }
                                    }}
                                    className="MuiIconButton-root"
                                >
                                    <CloseIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
};

export default SearchInput; 