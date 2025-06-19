import React, {useState, ChangeEvent, useEffect, useMemo, useRef} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {Container, Typography, TextField, Button, Box, InputAdornment, IconButton, useMediaQuery, Chip, Stack, Paper, List, ListItem, ListItemText} from '@mui/material';
import Link from '@mui/material/Link';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useHead } from '../hooks/useHead'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PhoneIcon from '@mui/icons-material/Phone';
import { getSearchHistory, addToSearchHistory, removeFromSearchHistory } from '../utils/cookieManager';

const MainPage: React.FC = () => {
    const headConfig = useMemo(() => ({
        title: '로생계산기',
        canonical: 'https://www.loalife.co.kr/',
        metas: [
            { name: 'description', content: '원정대의 주간 수급량을 한눈에 확인하세요.' },
            { name: 'robots',      content: 'index,follow' },
        ],
        scripts: [
            {
                innerHTML: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "로생계산기",
                    "url": "https://www.loalife.co.kr/",
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": "https://www.loalife.co.kr/result?name={name}",
                        "query-input": "required name=name"
                    }
                })
            }
        ],
    }), [])
    useHead(headConfig);

    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery('(max-width:800px)');

    useEffect(() => {
        if (location.state?.error) {
            setError(location.state.error);
        }
        // 검색 기록 로드
        setSearchHistory(getSearchHistory());
    }, [location.state]);

    const handleSearch = () => {
        if (!nickname.trim()) {
            setError('닉네임을 입력해주세요.');
            return;
        }
        // 검색 기록에 추가
        addToSearchHistory(nickname.trim());
        setSearchHistory(getSearchHistory());
        navigate(`/result?name=${encodeURIComponent(nickname)}`);
    };

    const handleHistoryClick = (historyNickname: string) => {
        setNickname(historyNickname);
        navigate(`/result?name=${encodeURIComponent(historyNickname)}`);
    };

    const handleRemoveHistory = (e: React.MouseEvent, historyNickname: string) => {
        e.stopPropagation(); // 이벤트 버블링 방지
        removeFromSearchHistory(historyNickname);
        setSearchHistory(getSearchHistory());
        // 포커스 상태 유지
        setIsFocused(true);
    };

    const handleContentReward = () => {
        navigate('/content-reward');
    };

    const handleMobileGuide = () => {
        navigate('/mobile-guide');
    };

    const handleLevelReward = () => {
        navigate('/level-reward');
    };

    return (
        <>
            <Box 
                sx={{
                    position: 'fixed',
                    top: 16,
                    left: 16,
                    zIndex: 1000,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    width: isMobile ? 'calc(100% - 32px)' : 'auto'
                }}
            >
                <Typography
                    sx={{
                        color: 'text.main',
                    }}
                >
                    이모티콘을 제공해주신 {' '}
                    <Link
                        href="https://coconut-emoji.tistory.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        color="primary.main"
                    >
                        코코넛콘
                    </Link>{' '}
                    님께 감사드립니다
                </Typography>
            </Box>
            <Box sx={{position: 'relative', minHeight: '100vh', width: '100vw'}}>
                {/* 중앙 검색창 */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100%',
                        maxWidth: 600,
                        px: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 2  // 검색 영역의 z-index 설정
                    }}
                >
                    {/* 제목 */}
                    <Box sx={{
                        position: 'absolute',
                        bottom: '100%',
                        mb: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        width: '100%'
                    }}>
                        <img
                            src="/images/mokoko/title_mokoko.png"
                            alt="로생계산기"
                            style={{
                                height: 90,
                                width: 'auto',
                                display: 'block'
                            }}
                        />
                        <Typography
                            variant="h2"
                            component="h1"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 'bold',
                                lineHeight: 1
                            }}
                        >
                            로생계산기
                        </Typography>
                    </Box>

                    {/* 검색창 */}
                    <Box sx={{ position: 'relative', width: '100%' }}>
                        <TextField
                            inputRef={searchInputRef}
                            fullWidth
                            label="닉네임을 적어주시면 계산해 드릴게요!"
                            variant="outlined"
                            value={nickname}
                            autoComplete="off"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
                            error={!!error}
                            helperText={error}
                            onFocus={() => setIsFocused(true)}
                            onBlur={(e) => {
                                // 삭제 버튼 클릭 시에는 onBlur 이벤트를 무시하고 포커스 상태 유지
                                if (e.relatedTarget?.closest('.MuiIconButton-root')) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsFocused(true);
                                    // 실제 포커스도 유지
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
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleSearch}
                                            edge="end"
                                            sx={{
                                                color: 'primary.main',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(46, 125, 50, 0.04)'
                                                }
                                            }}
                                        >
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '28px',
                                    height: '64px',
                                    fontSize: '1.4rem',
                                    '& fieldset': {
                                        borderColor: 'rgba(0, 0, 0, 0.23)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: '1rem',
                                    transform: 'translate(14px, 20px) scale(1)',
                                    '&.Mui-focused, &.MuiFormLabel-filled': {
                                        transform: 'translate(14px, -9px) scale(0.75)'
                                    }
                                },
                                '& .MuiInputBase-input': {
                                    fontSize: '1.4rem'
                                }
                            }}
                            focused={isFocused}
                        />
                        
                        {/* 검색 기록 드롭다운 */}
                        {isFocused && searchHistory.length > 0 && (
                            <Paper
                                elevation={3}
                                sx={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    mt: 1,
                                    zIndex: 1000,
                                    maxHeight: 'none',
                                    overflowY: 'visible',
                                    width: 'fit-content',
                                    minWidth: '50%',
                                    maxWidth: '100%'
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
                                                        color: 'text.primary',
                                                        wordBreak: 'break-all',
                                                        whiteSpace: 'normal'
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

                    {/* 모바일 가이드 링크 */}
                    <Typography
                        onClick={handleMobileGuide}
                        sx={{
                            mt: 1,
                            ml: 1.5,
                            alignSelf: 'flex-start',
                            color: 'primary.main',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            '&:hover': {
                                color: 'primary.dark'
                            }
                        }}
                    >
                        모바일 사용자이신가요?
                    </Typography>
                </Box>

                {/* 컨텐츠 보상 보기 버튼 */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 'calc(50% + 100px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '100%',
                        maxWidth: 600,
                        px: 2,
                        zIndex: 1  // 버튼 영역의 z-index 설정
                    }}
                >
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 2,
                            width: '100%',
                            maxWidth: 800,
                        }}
                    >
                        <Button
                            size="large"
                            onClick={handleContentReward}
                            sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                p: 2,
                                backgroundColor: '#2e7d32',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#1b5e20',
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src="/images/mokoko/flex_mokoko.png"
                                alt="컨텐츠 보상 보기"
                                sx={{
                                    width: 'auto',
                                    height: 'auto',
                                    maxWidth: '100%',
                                    maxHeight: 64,
                                    objectFit: 'contain'
                                }}
                            />
                            <Typography variant="h6" sx={{fontWeight: 'bold', color: 'white'}}>
                                컨텐츠 보상 보기
                            </Typography>
                            <Typography variant="body2" color="#f0f0f0" sx={{textAlign: 'center'}}>
                                컨텐츠의 보상 정보를 조회합니다
                            </Typography>
                        </Button>
                        <Button
                            size="large"
                            onClick={handleLevelReward}
                            sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                p: 2,
                                backgroundColor: '#2e7d32',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#1b5e20',
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src="/images/mokoko/how_is_it_mokoko.png"
                                alt="레벨로 계산하기"
                                sx={{
                                    width: 'auto',
                                    height: 'auto',
                                    maxWidth: '100%',
                                    maxHeight: 64,
                                    objectFit: 'contain'
                                }}
                            />
                            <Typography variant="h6" sx={{fontWeight: 'bold', color: 'white'}}>
                                레벨로 계산하기
                            </Typography>
                            <Typography variant="body2" color="#f0f0f0" sx={{textAlign: 'center'}}>
                                레벨에 따른 보상을 계산합니다
                            </Typography>
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default MainPage; 