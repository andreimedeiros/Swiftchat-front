import React from 'react';
import { Container, Typography, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Box, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; 
import './App.css'; 
import CadastroProcesso from './components/CadastroProcesso';
import ListaProcessos from './components/ListaProcessos';
import CadastroTipoProcesso from './components/CadastroTipoProcesso';
import ListaTiposProcessos from './components/ListaTiposProcessos';
import CadastroSetor from './components/CadastroSetor';
import ListaSetores from './components/ListaSetores';
import MovimentarProcesso from './components/MovimentarProcesso';

function App() {
  const [view, setView] = React.useState('list');
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuClick = (viewName) => {
    setView(viewName);
    setDrawerOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Adicionando a imagem de fundo */}
      <div className="background-overlay"></div>
      <AppBar position="static" color="primary" style={{ width: '100vw', left: 0, right: 0 }}>
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
              paddingRight: '48px',
            }}>
            Gestão de Processos
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          style: { width: 240, backgroundColor: theme.palette.primary.dark, color: '#ffffff' },
        }}
      >
        <List>
          <ListItem button onClick={() => handleMenuClick('list')}>
            <ListItemText primary="Ver Lista de Processos" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
          </ListItem>
          <Divider style={{ backgroundColor: theme.palette.primary.light }} />
          <ListItem button onClick={() => handleMenuClick('add')}>
            <ListItemText primary="Cadastrar Novo Processo" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
          </ListItem>
          <Divider style={{ backgroundColor: theme.palette.primary.light }} />
          <ListItem button onClick={() => handleMenuClick('tiposProcessos')}>
            <ListItemText primary="Tipos de Processos" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
          </ListItem>
          <Divider style={{ backgroundColor: theme.palette.primary.light }} />
          <ListItem button onClick={() => handleMenuClick('setores')}>
            <ListItemText primary="Setores" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
          </ListItem>
          <Divider style={{ backgroundColor: theme.palette.primary.light }} />
          <ListItem button onClick={() => handleMenuClick('movimentar')}>
            <ListItemText primary="Movimentar Processo" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
          </ListItem>
        </List>
      </Drawer>
      <Container className="container" maxWidth="lg">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box width="100%">
            {view === 'list' && <ListaProcessos />}
            {view === 'add' && <CadastroProcesso />}
            {view === 'tiposProcessos' && <ListaTiposProcessos />}
            {view === 'setores' && <ListaSetores />}
            {view === 'movimentar' && <MovimentarProcesso />}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
