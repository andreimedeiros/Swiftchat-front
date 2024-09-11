import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#008F6D', // Cor principal
    },
    secondary: {
      main: '#008F6D', // Cor secundária
    },
    background: {
      default: '#f4f6f8', // Cor de fundo geral
    },
  },
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif', // Ajustando a fonte
    h3: {
      fontWeight: 600,
      color: '#333',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '12px',
          borderRadius: '5px',
          boxShadow: '0px 10px 50px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;
