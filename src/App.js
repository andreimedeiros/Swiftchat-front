import React from 'react';
import { Container, Typography, AppBar, Toolbar, IconButton, Box, Button, Modal } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css'; 
import CadastroProcesso from './components/CadastroProcesso';
import ListaProcessos from './components/ListaProcessos';
import ListaTiposProcessos from './components/ListaTiposProcessos';
import ListaSetores from './components/ListaSetores';
import MovimentarProcesso from './components/MovimentarProcesso';
import Home from './components/Home';
import SideMenu from './components/SideMenu';
import Login from './components/Login';  // Importe o componente de login

function App() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuClick = (viewName) => {
    setDrawerOpen(false);
    window.location.href = `/${viewName}`;
  };

  const handleLoginOpen = () => {
    setLoginOpen(true);
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="background-overlay"></div>
        <AppBar position="static" color="primary" style={{ width: '100%', left: 0, right: 0 }}>
          <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h4" 
              noWrap 
              style={{ 
                fontWeight: 'bold', 
                textTransform: 'uppercase', 
                letterSpacing: '2px',
                color: '#ffffff',
                textShadow: '3px 3px 6px rgba(0, 0, 0, 0.7)',
                fontFamily: 'Arial, sans-serif',
                textAlign: 'center',
                flexGrow: 1,
                paddingRight: '0px',
              }}>
              {window.location.pathname === '/' || window.location.pathname === '/home' ? 'SwiftChat' : 'Gestão de Processos'}
            </Typography>
            <Button 
              variant="outlined" 
              color="inherit" 
              onClick={handleLoginOpen} 
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Login
            </Button>
          </Toolbar>
        </AppBar>
        <SideMenu open={drawerOpen} onClose={handleDrawerToggle} onMenuClick={handleMenuClick} />
        <Container className="container" maxWidth="lg">
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box width="100%">
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/list" element={<ListaProcessos />} />
                <Route path="/add" element={<CadastroProcesso />} />
                <Route path="/tiposProcessos" element={<ListaTiposProcessos />} />
                <Route path="/setores" element={<ListaSetores />} />
                <Route path="/movimentar" element={<MovimentarProcesso />} />
              </Routes>
            </Box>
          </Box>
        </Container>
        <Modal
          open={loginOpen}
          onClose={handleLoginClose}
          aria-labelledby="modal-login-title"
          aria-describedby="modal-login-description"
        >
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            sx={{ height: '100vh', padding: 2 }}
          >
            <Box 
              bgcolor="background.paper" 
              boxShadow={24} 
              p={4} 
              borderRadius={2}
              width={400}
            >
              <Login onClose={handleLoginClose} />
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleLoginClose}
                sx={{ marginTop: 2 }}
                fullWidth
              >
                Fechar
              </Button>
            </Box>
          </Box>
        </Modal>
      </Router>
    </ThemeProvider>
  );
}

export default App;
