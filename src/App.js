// Importações necessárias
import React from 'react';
import { Container, Typography, AppBar, Toolbar, IconButton, Box, Button, Modal } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; 
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css'; 
import CadastroProcesso from './components/CadastroProcesso';
import ListaProcessos from './components/ListaProcessos';
import ListaTiposProcessos from './components/ListaTiposProcessos';
import ListaSetores from './components/ListaSetores';
import MovimentarProcesso from './components/MovimentarProcesso';
import Home from './components/Home';
import SideMenu from './components/SideMenu';
import Login from './components/Login';
import CadastroUsuario from './components/CadastroUsuario';
import PrivateRoute from './components/PrivateRoute'; 
import Welcome from './components/Welcome'; // Importe o componente de boas-vindas

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="background-overlay"></div>
        <MainAppContent />
      </Router>
    </ThemeProvider>
  );
}

function MainAppContent() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [cadastroOpen, setCadastroOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuClick = (viewName) => {
    setDrawerOpen(false);
    navigate(`/${viewName}`);
  };

  const handleLoginOpen = () => {
    setLoginOpen(true);
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  const handleCadastroOpen = () => {
    setCadastroOpen(true);
  };

  const handleCadastroClose = () => {
    setCadastroOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    navigate('/home');
  };

  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <>
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
            {location.pathname === '/' || location.pathname === '/home' ? 'SwiftChat' : 'Gestão de Processos'}
          </Typography>
          <Box>
            {isAuthenticated ? (
              <Button 
                variant="outlined" 
                color="inherit" 
                onClick={handleLogout} 
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  marginRight: '10px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease',
                  },
                }}
              >
                Logout
              </Button>
            ) : location.pathname === '/' || location.pathname === '/home' ? (
              <>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  onClick={handleCadastroOpen} 
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    marginRight: 1, 
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'scale(1.05)',
                      transition: 'transform 0.3s ease',
                    },
                  }}
                >
                  Cadastre-se
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  onClick={handleLoginOpen} 
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'scale(1.05)',
                      transition: 'transform 0.3s ease',
                    },
                  }}
                  startIcon={<LoginIcon />}
                >
                  Login
                </Button>
              </>
            ) : (
              <Button 
                variant="outlined" 
                color="inherit" 
                onClick={() => navigate('/home')} 
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  marginRight: '10px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease',
                  },
                }}
                startIcon={<HomeIcon />}
              >
                Início
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <SideMenu open={drawerOpen} onClose={handleDrawerToggle} onMenuClick={handleMenuClick} />
      <Container className="container" maxWidth="lg">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box width="100%">
            <TransitionGroup>
              <CSSTransition
                key={location.key}
                classNames="fade"
                timeout={300}
              >
                <Routes location={location}>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<Home />} />
                  
                  {/* Rotas protegidas */}
                  <Route element={<PrivateRoute allowedRoles={['USUARIO']} />}>
                    <Route path="/user/processos" element={<ListaProcessos />} />
                    <Route path="/user/add" element={<CadastroProcesso />} />
                  </Route>
                  
                  <Route element={<PrivateRoute allowedRoles={['FUNCIONARIO']} />}>
                    <Route path="/funcionario/processos" element={<ListaProcessos />} />
                    <Route path="/funcionario/movimentar" element={<MovimentarProcesso />} />
                  </Route>

                  {/* Rota de boas-vindas */}
                  <Route path="/welcome" element={<Welcome />} />

                </Routes>
              </CSSTransition>
            </TransitionGroup>
          </Box>
        </Box>
      </Container>
      <Modal
        open={loginOpen}
        onClose={handleLoginClose}
        aria-labelledby="modal-login-title"
        aria-describedby="modal-login-description"
        sx={{
          transition: 'opacity 0.3s ease',
          opacity: loginOpen ? 1 : 0,
        }}
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
            sx={{
              transition: 'transform 0.3s ease',
              transform: loginOpen ? 'scale(1)' : 'scale(0.95)',
            }}
          >
            <Login onClose={handleLoginClose} />
            <Box display="flex" justifyContent="center">
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleLoginClose}
                sx={{ marginTop: 3 }}
              >
                Fechar
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={cadastroOpen}
        onClose={handleCadastroClose}
        aria-labelledby="modal-cadastro-title"
        aria-describedby="modal-cadastro-description"
        sx={{
          transition: 'opacity 0.3s ease',
          opacity: cadastroOpen ? 1 : 0,
        }}
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
            sx={{
              transition: 'transform 0.3s ease',
              transform: cadastroOpen ? 'scale(1)' : 'scale(0.95)',
            }}
          >
            <CadastroUsuario onClose={handleCadastroClose} />
            <Box display="flex" justifyContent="center">
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleCadastroClose}
                sx={{ marginTop: 3 }}
              >
                Fechar
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default App;
