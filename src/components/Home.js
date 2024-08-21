import React, { useState } from 'react';
import { Container, Typography, Box, Button, Modal, Paper } from '@mui/material';
import Login from './Login';

const Home = () => {
  const [loginOpen, setLoginOpen] = useState(false);

  const handleLoginOpen = () => {
    setLoginOpen(true);
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  return (
    <Container 
  maxWidth="lg" 
  sx={{ 
    height: '20vh', 
    position: 'relative', 
    overflow: 'hidden',  // Remove qualquer overflow
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
  >

  </Box>
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    sx={{ height: '100%', textAlign: 'center', padding: 2 }}
  >
    <Typography variant="h3" color="primary" gutterBottom>
      Bem-vindo ao SwiftChat
    </Typography>
    <Typography variant="h6" color="textSecondary" align="center">
      Uma plataforma de gestão eficiente para seus processos.
    </Typography>
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
