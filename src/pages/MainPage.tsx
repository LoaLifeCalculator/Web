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
    const searchParams = new URLSearchParams(location.search);
    const errorMsg = searchParams.get('error');
    if (errorMsg) {
      setError(errorMsg);
    }
  }, [location.search]);

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
      {/* 상단 고정 제목 */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 10, bgcolor: 'background.default', py: 3, boxShadow: 0, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          로생 계산기
        </Typography>
      </Box>
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
        }}
      >
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
                <IconButton onClick={handleSearch} edge="end">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '28px',
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
          }}
        />
        <Button
          fullWidth
          variant="outlined"
          startIcon={<CardGiftcardIcon />}
          onClick={handleContentReward}
        >
          컨텐츠 보상 보기
        </Button>
      </Box>
    </Box>
  );
};

export default MainPage; 