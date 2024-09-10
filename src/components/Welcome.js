import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Welcome = () => {
  const userType = localStorage.getItem('userType');
  const userName = localStorage.getItem('userName'); // Certifique-se de que está correto


  return (
    <Paper elevation={3} sx={{ padding: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Bem-vindo(a), {userName ? userName : 'Usuário'}
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          {userType === 'FUNCIONARIO' ? 'Você está logado(a) como Funcionário(a).' : 'Você está logado(a) como Usuário(a).'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default Welcome;
