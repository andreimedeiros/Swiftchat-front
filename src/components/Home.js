import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Modal, Paper, Grid, Card, CardContent, TextField, Button, Snackbar, Alert } from '@mui/material';
import Login from './Login';
import api from '../services/api';

const Home = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [userData, setUserData] = useState(null);
  
  // Estados para o Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const userName = localStorage.getItem('userName'); // Verifica se há um usuário logado

  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  const handleConfigOpen = () => setConfigOpen(true);
  const handleConfigClose = () => setConfigOpen(false);
  
  // Função para fechar o Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    api.get('/usuarios/me')
      .then((response) => {
        setUserData(response.data);
        setNome(response.data.nome);
        setSobrenome(response.data.sobrenome);
        localStorage.setItem('userName', `${response.data.nome} ${response.data.sobrenome}`);
      })
      .catch((error) => console.error('Erro ao buscar dados do usuário:', error));
  }, []);

  const handleUpdateUser = () => {
    const updateData = {
      nome,
      sobrenome,
    };

    api.put('/usuarios/me/atualizar-nome-sobrenome', updateData)
      .then((response) => {
        setUserData(response.data);
        localStorage.setItem('userName', `${response.data.nome} ${response.data.sobrenome}`);
        setConfigOpen(false);

        // Exibir Snackbar de sucesso
        setSnackbarMessage('Nome e sobrenome atualizados com sucesso!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        // Exibir Snackbar de erro
        setSnackbarMessage('Erro ao atualizar nome e sobrenome. Tente novamente.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        console.error('Erro ao atualizar nome:', error);
      });
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        height: 'auto', 
        position: 'relative', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0
      }}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        sx={{ padding: 2, position: 'absolute', top: 0, right: 0 }}
      />

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ height: '20vh', textAlign: 'center', padding: 2 }}
      >
        <Typography variant="h3" color="primary" gutterBottom>
          {userName ? `Bem-vindo(a) ao SwiftChat, ${userName}!` : 'Bem-vindo(a) ao SwiftChat'}
        </Typography>
        <Typography variant="h6" color="textSecondary" align="center">
          Uma plataforma de gestão eficiente para seus processos.
        </Typography>
      </Box>

      <Box sx={{ width: '100%', marginTop: 4 }}>
        <Grid container spacing={2} justifyContent="center">
          {userName ? (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Processos Recentes
                    </Typography>
                    <Typography variant="body2">
                      Acesse rapidamente seus processos recentes.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Aprovações Pendentes
                    </Typography>
                    <Typography variant="body2">
                      Veja os processos aguardando sua aprovação.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card onClick={handleConfigOpen} sx={{ cursor: 'pointer' }}>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Configurações
                    </Typography>
                    <Typography variant="body2">
                      Personalize suas preferências e configurações.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Relatórios
                    </Typography>
                    <Typography variant="body2">
                      Acesse os relatórios de desempenho e resultados.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </>
          ) : (
            <>
              {/* Outros cards para visitantes */}
            </>
          )}
        </Grid>
      </Box>

      {/* Modal para Configurações */}
      <Modal
        open={configOpen}
        onClose={handleConfigClose}
        aria-labelledby="modal-config-title"
        aria-describedby="modal-config-description"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ height: '100vh' }}
        >
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Typography variant="h6" id="modal-config-title" gutterBottom>
              Atualizar Nome e Sobrenome
            </Typography>
            <TextField
              label="Nome"
              fullWidth
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Sobrenome"
              fullWidth
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              margin="normal"
            />
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="contained" color="primary" onClick={handleUpdateUser}>
                Salvar
              </Button>
              <Button onClick={handleConfigClose} sx={{ ml: 2 }}>
                Cancelar
              </Button>
            </Box>
          </Paper>
        </Box>
      </Modal>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Modal para Login */}
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
          sx={{ height: '100vh' }}
        >
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Login onClose={handleLoginClose} />
          </Paper>
        </Box>
      </Modal>
    </Container>
  );
};

export default Home;
