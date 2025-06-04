import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PhoneIcon from '@mui/icons-material/Phone';

const MainPage: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
    }
  }, [location.state]);

  const handleSearch = () => {
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    navigate(`/result?name=${encodeURIComponent(nickname)}`);
  };

  const handleContentReward = () => {
    navigate('/content-reward');
  };

  const handleMobileGuide = () => {
    navigate('/mobile-guide');
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', width: '100vw' }}>
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
          alignItems: 'center'
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
          gap: 1
        }}>
          <img 
            src="/images/common/calculate_mokoko.png" 
            alt="로생계산기" 
            style={{ 
              height: 64,
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
            로생 계산기
          </Typography>
        </Box>

        {/* 검색창 */}
        <TextField
          fullWidth
          label="닉네임을 적어주시면 계산해 드릴게요!"
          variant="outlined"
          value={nickname}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
          error={!!error}
          helperText={error}
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
                    p: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <SearchIcon sx={{ fontSize: '2rem' }} />
                </IconButton>
              </InputAdornment>
            ),
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
        />

        {/* 모바일 가이드 링크 */}
        <Typography
          onClick={handleMobileGuide}
          sx={{
            mt: 2,
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

        {/* 컨텐츠 보상 보기 버튼 */}
        <Button
          variant="outlined"
          startIcon={<CardGiftcardIcon />}
          onClick={handleContentReward}
          sx={{
            position: 'absolute',
            top: '100%',
            mt: 12,
            height: 56,
            fontSize: '1.1rem',
            borderRadius: '28px',
            px: 3,
            py: 1.5
          }}
        >
          컨텐츠 보상 보기
        </Button>
      </Box>
    </Box>
  );
};

export default MainPage; 