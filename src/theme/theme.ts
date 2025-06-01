import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // 진한 초록색
      light: '#4caf50', // 밝은 초록색
      dark: '#1b5e20', // 어두운 초록색
    },
    secondary: {
      main: '#59B55D', // 연한 초록색
      light: '#81c784',
      dark: '#388e3c',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    reward: {
      background: '#E8F5E9',
    },
    text: {
      primary: '#37474F',
      secondary: '#7f8c8d',
    },
    switch: {
      main: '#3F51B5',
    },
  },
  typography: {
    fontFamily: [
      'Noto Sans KR',
      'Apple SD Gothic Neo',
      'Malgun Gothic',
      '맑은 고딕',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 700,
      color: '#2e7d32', // 진한 초록색
    },
    h5: {
      fontWeight: 600,
      color: '#2e7d32', // 진한 초록색
    },
    h6: {
      fontWeight: 600,
      color: '#2e7d32', // 진한 초록색
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: '#F6FFF0',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          '&.MuiButton-contained': {
            backgroundColor: '#3F51B5',
            '&:hover': {
              backgroundColor: '#303F9F',
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#3F51B5',
            '& + .MuiSwitch-track': {
              backgroundColor: '#3F51B5',
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#3F51B5',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#3F51B5',
          },
        },
      },
    },
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    reward: {
      background: string;
    };
    switch: {
      main: string;
    };
  }
  interface PaletteOptions {
    reward: {
      background: string;
    };
    switch: {
      main: string;
    };
  }
}

export default theme; 