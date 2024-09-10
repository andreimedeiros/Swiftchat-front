import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onClose }) => {
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const cleanCpfCnpj = cpfCnpj.replace(/\D/g, '');
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        cpfCnpj: cleanCpfCnpj,
        password,
      });

      const { token, userType, userName } = response.data; // Verifique se `userName` está correto

      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('userName', userName); // Certifique-se de que `userName` está realmente sendo passado na resposta

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      navigate('/welcome'); // Redireciona para a tela de boas-vindas
      onClose();
    } catch (error) {
      console.error('Erro ao fazer login:', error.response || error);
      alert('Erro ao fazer login. Por favor, tente novamente.');
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Login
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center">
        <TextField
          label="CPF/CNPJ"
          variant="outlined"
          fullWidth
          margin="normal"
          value={cpfCnpj}
          onChange={(e) => setCpfCnpj(e.target.value)}
        />
        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleLogin} sx={{ marginTop: 2 }}>
          Login
        </Button>
      </Box>
    </Paper>
  );
};

export default Login;
