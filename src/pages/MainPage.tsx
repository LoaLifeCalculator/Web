import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

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
        <Box sx={{ mb: 4 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 1
            }}
          >
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
        </Box>
        <TextField
          fullWidth
          label="닉네임을 입력해주세요"
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
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '28px',
              height: '64px',
              fontSize: '1.4rem',
              '& fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
            '& .MuiInputLabel-root': {
              fontSize: '1.3rem'
            },
            '& .MuiInputBase-input': {
              fontSize: '1.4rem'
            }
          }}
        />
        <Button
          variant="outlined"
          startIcon={<CardGiftcardIcon />}
          onClick={handleContentReward}
          sx={{
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