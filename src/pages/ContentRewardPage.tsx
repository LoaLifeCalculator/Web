import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import { getContentRewards, ContentSection, ContentReward } from '../services/api';

const ContentRewardPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPriceEditor, setShowPriceEditor] = useState(false);
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContentRewards = async () => {
      try {
        const data = await getContentRewards();
        setContentSections(data);
      } catch (error) {
        setError('컨텐츠 보상 정보를 불러오는데 실패했습니다.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchContentRewards();
  }, []);

  const handleHome = () => {
    navigate('/');
  };

  const togglePriceEditor = () => {
    setShowPriceEditor(!showPriceEditor);
  };

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">컨텐츠 보상</Typography>
          <IconButton onClick={togglePriceEditor}>
            <EditIcon />
          </IconButton>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ mt: 4 }}>
            {error}
          </Typography>
        ) : (
          contentSections.map((section, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{section.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {section.rewards.map((reward: ContentReward, rewardIndex: number) => (
                  <Box
                    key={rewardIndex}
                    sx={{
                      mb: 2,
                      p: 2,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant="h6">{reward.name}</Typography>
                    <Typography>골드: {reward.gold.toLocaleString()}</Typography>
                    {reward.details.map((detail: string, detailIndex: number) => (
                      <Typography key={detailIndex} color="text.secondary">
                        {detail}
                      </Typography>
                    ))}
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          ))
        )}

        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            bgcolor: 'background.paper',
            boxShadow: 3
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={handleHome}
          >
            <HomeIcon sx={{ mr: 1 }} />
            <Typography>홈</Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ContentRewardPage; 