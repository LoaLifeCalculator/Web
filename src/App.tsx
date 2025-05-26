import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ResultPage from './pages/ResultPage';
import ContentRewardPage from './pages/ContentRewardPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Noto Sans KR',
      'Apple SD Gothic Neo',
      'Malgun Gothic',
      '맑은 고딕',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/content-reward" element={<ContentRewardPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
