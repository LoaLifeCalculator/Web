import React, { useState, useEffect, useRef } from 'react';
import { OutlinedInput, InputAdornment, IconButton, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchInputProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ searchQuery, setSearchQuery }) => {
    const theme = useTheme();
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
    const searchInputRef = useRef<HTMLInputElement>(null);

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
        searchInputRef.current?.focus();
    };

    return (
        <OutlinedInput
            inputRef={searchInputRef}
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
    );
};

export default SearchInput; 