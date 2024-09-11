import React, { useState } from 'react';
// Remova esta linha, pois não precisa mais importar o axios diretamente
// import axios from 'axios';
import api from '../services/api';
import { Container, TextField, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Button, Typography, Paper, Snackbar, Alert } from '@mui/material';

const CadastroUsuario = () => {
  const [tipoPessoa, setTipoPessoa] = useState('fisica');
  const [cpf, setCpf] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('1');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (senha !== confirmarSenha) {
      setSnackbarMessage('As senhas não coincidem. Tente novamente.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const usuario = {
      cpf: tipoPessoa === 'fisica' ? cpf.replace(/\D/g, '') : null,
      cnpj: tipoPessoa === 'juridica' ? cnpj.replace(/\D/g, '') : null,
      nome,
      sobrenome: tipoPessoa === 'fisica' ? sobrenome : null,
      password: senha,
      tipoUsuario: parseInt(tipoUsuario),
    };

    try {
      // Aqui utilizamos a instância personalizada de Axios
      const response = await api.post('/usuarios/register', usuario);

      if (response.status === 200) {
        setSnackbarMessage('Usuário cadastrado com sucesso!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setCpf('');
        setCnpj('');
        setNome('');
        setSobrenome('');
        setSenha('');
        setConfirmarSenha('');
        setTipoUsuario('1');
        setTipoPessoa('fisica');
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      setSnackbarMessage('Erro ao cadastrar usuário. Verifique os campos e tente novamente.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Cadastro de Usuário
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">Tipo de Pessoa</FormLabel>
            <RadioGroup
              value={tipoPessoa}
              onChange={(e) => setTipoPessoa(e.target.value)}
              row
            >
              <FormControlLabel value="fisica" control={<Radio />} label="Pessoa Física" />
              <FormControlLabel value="juridica" control={<Radio />} label="Pessoa Jurídica" />
            </RadioGroup>
          </FormControl>

          {tipoPessoa === 'fisica' && (
            <>
              <TextField
                label="Nome"
                variant="outlined"
                fullWidth
                margin="normal"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <TextField
                label="Sobrenome"
                variant="outlined"
                fullWidth
                margin="normal"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                required
              />

              <TextField
                label="CPF"
                variant="outlined"
                fullWidth
                margin="normal"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </>
          )}

          {tipoPessoa === 'juridica' && (
            <>
              <TextField
                label="Nome da Empresa"
                variant="outlined"
                fullWidth
                margin="normal"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <TextField
                label="CNPJ"
                variant="outlined"
                fullWidth
                margin="normal"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                required
              />
            </>
          )}

          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <TextField
            label="Confirmar Senha"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />

          <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Cadastrar
          </Button>
        </form>
      </Paper>

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
    </Container>
  );
};

export default CadastroUsuario;
