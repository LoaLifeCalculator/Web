import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ResultPage from './pages/ResultPage';
import ContentRewardPage from './pages/ContentRewardPage';
import MobileGuidePage from './pages/MobileGuidePage';
import LevelRewardPage from './pages/LevelRewardPage';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/content-reward" element={<ContentRewardPage />} />
          <Route path="/mobile-guide" element={<MobileGuidePage />} />
          <Route path="/level-reward" element={<LevelRewardPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
