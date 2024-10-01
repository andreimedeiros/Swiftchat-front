import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosRetry from 'axios-retry';

const Login = ({ onClose }) => {
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const navigate = useNavigate();

  axiosRetry(axios, {
    retries: 3,
    retryDelay: (retryCount) => retryCount * 1000, // TOLERÂNCIA A FALAHAS -> Tenta 3 vezes em caso de erro
    retryCondition: (error) => error.response.status >= 500, // Somente tenta de novo em erros 5xx (falha no servidor)
  });
  // Função pra remover caracteres nao numericos
  const limparFormato = (valor) => valor.replace(/\D/g, '');
  // Função pra formatar CPF e CNPJ conforme o usuário digita
  const formatarCpfCnpj = (valor) => {
    valor = limparFormato(valor);
    if (valor.length <= 11) {
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else if (valor.length <= 14) {
      valor = valor.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
    }
    return valor;
  };

  const handleCpfCnpjChange = (e) => {
    setCpfCnpj(formatarCpfCnpj(e.target.value));
  };

  const handleLogin = async (event) => {
    event.preventDefault();  // Previne o comportamento padrão do submit

    try {
      const cleanCpfCnpj = limparFormato(cpfCnpj);
      const response = await axios.post('http://localhost:8080/api/login', {
        cpfCnpj: cleanCpfCnpj,
        password,
      }, {
        timeout: 5000, // Tolerancia a Falhas:Timeout de 5 segundos
      });

      const { token, userType, userName } = response.data;

      console.log(`Login bem-sucedido para o usuário: ${userName} (${userType})`);

      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('userName', userName);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      navigate('/home');
      onClose();
    } catch (error) {
      // Log de erro no login
      if (error.code === 'ECONNABORTED') {
        console.warn('A conexão demorou muito para responder.');
        setSnackbarMessage('A conexão demorou muito para responder. Por favor, tente novamente mais tarde.');
      } else if (error.response) {
        console.error(`Erro no login: ${error.response.status} - ${error.response.data}`);
        if (error.response.status >= 500) {
          setSnackbarMessage('Erro no servidor. Estamos tentando novamente...');
        } else if (error.response.status === 401) {
          setSnackbarMessage('Credenciais inválidas. Verifique CPF/CNPJ e senha.');
        } else {
          setSnackbarMessage('Erro ao fazer login. Tente novamente.');
        }
      } else {
        console.error('Erro desconhecido ao fazer login:', error);
        setSnackbarMessage('Erro ao fazer login. Por favor, verifique sua conexão.');
      }
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
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
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
          <Box display="flex" justifyContent="center" sx={{ marginTop: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </Box>
        </form>
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
