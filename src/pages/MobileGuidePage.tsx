import React, { useState } from 'react';
import { Box, Typography, Button, Container, Paper, Card, CardContent, CardHeader, IconButton, Collapse, useTheme, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ComputerIcon from '@mui/icons-material/Computer';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import ChromeIcon from '../components/ChromeIcon';

interface PlatformCardProps {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ title, icon, content, expanded, onToggle }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        onClick={onToggle}
        sx={{ 
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon}
            <Typography variant="h6">{title}</Typography>
          </Box>
        }
        action={
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            sx={{
              transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s'
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        }
      />
      <Collapse in={expanded}>
        <CardContent>
          {content}
        </CardContent>
      </Collapse>
    </Card>
  );
};

const MobileGuidePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [expandedCards, setExpandedCards] = useState({
    iosSafari: false,
    iosChrome: false,
    androidApp: false,
    androidChrome: false,
    pcApp: false
  });

  const handleToggle = (card: keyof typeof expandedCards) => {
    setExpandedCards(prev => ({
      ...prev,
      [card]: !prev[card]
    }));
  };

  return (
    <Container maxWidth="sm" sx={{ px: 0 }}>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: '1.5rem' }} />}
          onClick={() => navigate('/')}
          sx={{ 
            mb: 2,
            ml: 2,
            fontSize: '1.2rem',
            '& .MuiButton-startIcon': {
              marginRight: 1
            }
          }}
        >
            돌아가기
        </Button>

        <Paper elevation={3} sx={{ p: 3, mb: 3, mx: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 3 }}>
            <img 
              src="/images/mokoko/phone_mokoko.png"
              alt="모코코" 
              style={{ 
                height: 64,
                width: 'auto',
                marginRight: 16
              }}
            />
            <Typography variant="h5" component="h1" gutterBottom sx={{ color: 'text.primary' }}>
              로생계산기 앱 설치 가이드
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <PlatformCard
            title="iOS Safari"
            icon={<AppleIcon sx={{ color: 'primary.main' }} />}
            expanded={expandedCards.iosSafari}
            onToggle={() => handleToggle('iosSafari')}
            content={
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src="/images/mobile-guide/iOS_safari_1.webp" 
                    alt="Safari 브라우저에서 로생계산기 접속" 
                    style={{ 
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px'
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body1" sx={{ mb: 2, textAlign: 'left', fontSize: '1.1rem', fontWeight: 500 }}>
                    <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>1.</Typography> 하단의 <Typography component="span" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1.1rem' }}>공유 버튼</Typography>을 클릭하세요
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src="/images/mobile-guide/iOS_safari_2.webp" 
                    alt="Safari 공유 버튼 클릭" 
                    style={{ 
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px'
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body1" sx={{ mb: 2, textAlign: 'left', fontSize: '1.1rem', fontWeight: 500 }}>
                    <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>2.</Typography> <Typography component="span" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1.1rem' }}>홈 화면에 추가</Typography> 버튼을 클릭하세요
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src="/images/mobile-guide/iOS_safari_3.webp" 
                    alt="홈 화면에 추가 선택" 
                    style={{ 
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px'
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body1" sx={{ mb: 2, textAlign: 'left', fontSize: '1.1rem', fontWeight: 500 }}>
                    <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>3.</Typography> <Typography component="span" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1.1rem' }}>추가</Typography> 버튼을 클릭하면 완료!
                  </Typography>
                </Box>
              </Box>
            }
          />

          <PlatformCard
            title="iOS Chrome"
            icon={<ChromeIcon style={{ color: theme.palette.primary.main, width: 24, height: 24 }} />}
            expanded={expandedCards.iosChrome}
            onToggle={() => handleToggle('iosChrome')}
            content={
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src="/images/mobile-guide/iOS_chrome_1.webp" 
                    alt="Chrome 브라우저에서 로생계산기 접속" 
                    style={{ 
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px'
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body1" sx={{ mb: 2, textAlign: 'left', fontSize: '1.1rem', fontWeight: 500 }}>
                    <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>1.</Typography> 우측 상단의 <Typography component="span" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1.1rem' }}>공유 버튼</Typography>을 클릭하세요
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src="/images/mobile-guide/iOS_chrome_2.webp" 
                    alt="Chrome 메뉴 버튼 클릭" 
                    style={{ 
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px'
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body1" sx={{ mb: 2, textAlign: 'left', fontSize: '1.1rem', fontWeight: 500 }}>
                    <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>2.</Typography> <Typography component="span" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1.1rem' }}>홈 화면에 추가</Typography> 버튼을 클릭하세요
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src="/images/mobile-guide/iOS_chrome_3.webp" 
                    alt="홈 화면에 추가 선택" 
                    style={{ 
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px'
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body1" sx={{ mb: 2, textAlign: 'left', fontSize: '1.1rem', fontWeight: 500 }}>
                    <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>3.</Typography> <Typography component="span" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1.1rem' }}>추가</Typography> 버튼을 클릭하면 완료!
                  </Typography>
                </Box>
              </Box>
            }
          />

          <PlatformCard
            title="안드로이드 앱"
            icon={<AndroidIcon sx={{ color: 'primary.main' }} />}
            expanded={expandedCards.androidApp}
            onToggle={() => handleToggle('androidApp')}
            content={
              <Box>
                <Typography variant="body2" paragraph>
                  안드로이드 앱은 개발 중입니다.
                </Typography>
              </Box>
            }
          />

          <PlatformCard
            title="안드로이드 Chrome"
            icon={<ChromeIcon style={{ color: theme.palette.primary.main, width: 24, height: 24 }} />}
            expanded={expandedCards.androidChrome}
            onToggle={() => handleToggle('androidChrome')}
            content={
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src="/images/mobile-guide/android_chrome_1.webp" 
                    alt="Chrome 브라우저에서 로생계산기 접속" 
                    style={{ 
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px'
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body1" sx={{ mb: 2, textAlign: 'left', fontSize: '1.1rem', fontWeight: 500 }}>
                    <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>1.</Typography> 우측 상단의 <Typography component="span" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1.1rem' }}>메뉴 버튼</Typography>을 클릭하세요
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src="/images/mobile-guide/android_chrome_2.webp" 
                    alt="Chrome 메뉴 버튼 클릭" 
                    style={{ 
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px'
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body1" sx={{ mb: 2, textAlign: 'left', fontSize: '1.1rem', fontWeight: 500 }}>
                    <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>2.</Typography> <Typography component="span" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1.1rem' }}>홈 화면에 추가</Typography> 버튼을 클릭하세요
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src="/images/mobile-guide/android_chrome_3.webp" 
                    alt="홈 화면에 추가 선택" 
                    style={{ 
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px'
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body1" sx={{ mb: 2, textAlign: 'left', fontSize: '1.1rem', fontWeight: 500 }}>
                    <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>3.</Typography> <Typography component="span" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1.1rem' }}>설치</Typography> 버튼을 클릭하면 완료!
                  </Typography>
                </Box>
              </Box>
            }
          />

          <PlatformCard
            title="PC 앱"
            icon={<ComputerIcon sx={{ color: 'primary.main' }} />}
            expanded={expandedCards.pcApp}
            onToggle={() => handleToggle('pcApp')}
            content={
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src="/images/mobile-guide/pc_chrome_1.webp" 
                    alt="Chrome 브라우저에서 로생계산기 접속" 
                    style={{ 
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px'
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body1" sx={{ mb: 2, textAlign: 'left', fontSize: '1.1rem', fontWeight: 500 }}>
                    <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>1.</Typography> 주소창 오른쪽의 <Typography component="span" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1.1rem' }}>설치 아이콘</Typography>을 클릭해서 설치해주세요.
                  </Typography>
                </Box>
              </Box>
            }
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default MobileGuidePage; 