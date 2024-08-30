import React, { useState } from 'react';
import { Container, TextField, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Button, Typography, Paper, Snackbar, Alert } from '@mui/material';

const CadastroUsuario = () => {
  const [cpf, setCpf] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('1'); // 1 = Usuário Comum, 2 = Funcionário

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
      cpf: cpf.replace(/\D/g, ''),
      cnpj: cnpj.replace(/\D/g, ''),
      nome,
      sobrenome,
      password: senha,
      tipoUsuario: parseInt(tipoUsuario),
    };

    try {
      // Substitua pela chamada de API adequada
      // await api.post('/usuarios', usuario);
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
          <TextField
            label="CPF"
            variant="outlined"
            fullWidth
            margin="normal"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />

          <TextField
            label="CNPJ"
            variant="outlined"
            fullWidth
            margin="normal"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
          />

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

          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">Tipo de Usuário</FormLabel>
            <RadioGroup
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
              row
            >
              <FormControlLabel value="1" control={<Radio />} label="Usuário Comum" />
              <FormControlLabel value="2" control={<Radio />} label="Funcionário" />
            </RadioGroup>
          </FormControl>

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
