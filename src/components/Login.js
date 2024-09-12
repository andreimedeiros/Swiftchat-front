import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onClose }) => {
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const navigate = useNavigate();

  // Função para remover caracteres não numéricos
  const limparFormato = (valor) => {
    return valor.replace(/\D/g, '');
  };

  // Função para formatar CPF e CNPJ conforme o usuário digita
  const formatarCpfCnpj = (valor) => {
    valor = limparFormato(valor); // Removemos todos os caracteres não numéricos

    if (valor.length <= 11) {
      // Formatar CPF: 000.000.000-00
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else if (valor.length <= 14) {
      // Formatar CNPJ: 00.000.000/0000-00
      valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
      valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
      valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
    }

    return valor;
  };

  const handleCpfCnpjChange = (e) => {
    setCpfCnpj(formatarCpfCnpj(e.target.value)); // Aplica a formatação automaticamente
  };

  const handleLogin = async () => {
    try {
      const cleanCpfCnpj = limparFormato(cpfCnpj); // Enviamos apenas os números

      const response = await axios.post('http://localhost:8080/api/login', {
        cpfCnpj: cleanCpfCnpj,
        password,
      });

      const { token, userType, userName } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('userName', userName);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      navigate('/home'); // Redireciona para a tela de boas-vindas
      onClose();
    } catch (error) {
      console.error('Erro ao fazer login:', error.response || error);
      setSnackbarMessage('Erro ao fazer login. Por favor, tente novamente.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
          onChange={handleCpfCnpjChange}
          required
        />
        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button variant="contained" color="primary" onClick={handleLogin} sx={{ marginTop: 2 }}>
          Login
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default Login;
