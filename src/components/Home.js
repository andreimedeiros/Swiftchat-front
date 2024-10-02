import React, { useState } from 'react';
import { Container, Typography, Box, Modal, Paper, Grid, Card, CardContent } from '@mui/material';
import Login from './Login';

const Home = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const userName = localStorage.getItem('userName'); // Verifica se há um usuário logado

  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  // Funções temporárias para obter o número de processos e usuários no sistema
  

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

      {/* Seção de Cards */}
      <Box sx={{ width: '100%', marginTop: 4 }}>
        <Grid container spacing={2} justifyContent="center">
          {userName ? (
            // Exibe os principais acessos para o usuário logado
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
                <Card>
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
            // Exibe informações gerais se ninguém estiver logado
            <>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Total de Processos
                    </Typography>
                    <Typography variant="body2">
                       Processos no sistema.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Total de Usuários
                    </Typography>
                    <Typography variant="body2">
                       usuários registrados.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Processos Aprovados
                    </Typography>
                    <Typography variant="body2">
                      80 processos aprovados até o momento e contando.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Processos Pendentes
                    </Typography>
                    <Typography variant="body2">
                      40 processos aguardando aprovação.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      </Box>

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
