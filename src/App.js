import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, AppBar, Toolbar, IconButton, Box, Button, Modal } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css'; 
import CadastroProcesso from './components/CadastroProcesso'; // Certifique-se de que o caminho está correto
import ListaProcessos from './components/ListaProcessos';
import ListaTiposProcessos from './components/ListaTiposProcessos';
import ListaSetores from './components/ListaSetores';
import MovimentarProcesso from './components/MovimentarProcesso';
import Home from './components/Home';
import SideMenu from './components/SideMenu';
import Login from './components/Login';
import CadastroUsuario from './components/CadastroUsuario';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false); // Controle do SideMenu
  const [loginOpen, setLoginOpen] = useState(false); // Controle do modal de login

  // Função para abrir/fechar o SideMenu
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuClick = (viewName) => {
    setDrawerOpen(false); // Fecha o SideMenu após clicar em um item
    window.location.href = `/${viewName}`; // Redireciona para a rota clicada
  };

  const handleLoginOpen = () => {
    setLoginOpen(true); // Abre o modal de login
  };

  const handleLoginClose = () => {
    setLoginOpen(false); // Fecha o modal de login
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/home';
  };

  const isLoggedIn = !!localStorage.getItem('token'); // Verifica se o usuário está logado
  const userType = localStorage.getItem('userType'); // Pega o tipo de usuário

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
            {!isLoggedIn && ( // Exibe o botão de login apenas se não estiver logado
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
            )}
          </Toolbar>
        </AppBar>
        {/* Menu lateral */}
        <SideMenu 
          open={drawerOpen} 
          onClose={handleDrawerToggle} 
          onMenuClick={handleMenuClick} 
          onLogout={handleLogout}
        />
        <Container className="container" maxWidth="lg">
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box width="100%">
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />
                {/* Exibe as rotas apenas se estiver logado */}
                {isLoggedIn && userType === 'USUARIO' && (
                  <>
                    <Route path="/list" element={<ListaProcessos />} />
                    <Route path="/add" element={<CadastroProcesso />} /> {/* Adiciona a rota de cadastro de processo */}
                  </>
                )}
                {isLoggedIn && userType === 'FUNCIONARIO' && (
                  <>
                    <Route path="/list" element={<ListaProcessos />} />
                    <Route path="/movimentar" element={<MovimentarProcesso />} />
                  </>
                )}
                <Route path="/cadastrarUsuario" element={<CadastroUsuario />} />
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
