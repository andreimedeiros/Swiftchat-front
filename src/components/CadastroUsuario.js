import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Container, TextField, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Button, Typography, Paper, Snackbar, Alert, MenuItem } from '@mui/material';
import axiosRetry from 'axios-retry';



axiosRetry(api, { retries: 3 }); // T. A FALHAS :  Tenta 3 vezes em caso de falha de conxao 

const CadastroUsuario = () => {
  const [tipoPessoa, setTipoPessoa] = useState('fisica');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('1'); // Usuário comum por padrão
  const [matricula, setMatricula] = useState(''); // Adicionar matrícula se for funcionário
  const [setores, setSetores] = useState([]); // Lista de setores
  const [setorSelecionado, setSetorSelecionado] = useState(''); // Setor selecionado
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const limparFormato = (valor) => valor.replace(/\D/g, '');

  const formatarCpfCnpj = (valor) => {
    valor = limparFormato(valor);

    if (tipoPessoa === 'fisica') {
      if (valor.length <= 11) {
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      }
    } else if (tipoPessoa === 'juridica') {
      if (valor.length <= 14) {
        valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
        valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
        valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
      }
    }
    return valor;
  };

  const handleCpfCnpjChange = (e) => {
    setCpfCnpj(formatarCpfCnpj(e.target.value));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (senha !== confirmarSenha) {
      setSnackbarMessage('As senhas não coincidem. Tente novamente.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (tipoUsuario === '2' && matricula.length !== 11) {
      setSnackbarMessage('A matrícula deve ter exatamente 11 dígitos.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const usuario = {
      cpf: tipoPessoa === 'fisica' ? limparFormato(cpfCnpj) : null,
      cnpj: tipoPessoa === 'juridica' ? limparFormato(cpfCnpj) : null,
      nome,
      sobrenome: tipoPessoa === 'fisica' ? sobrenome : null,
      razaoSocial: tipoPessoa === 'juridica' ? razaoSocial : null,
      password: senha,
      tipoUsuario: parseInt(tipoUsuario),
      matricula: tipoUsuario === '2' ? matricula : null,
      setor: tipoUsuario === '2' ? { id: setorSelecionado } : null // Enviar setor se for funcionário
    };

    try {
      // Requisição de cadastro de usuário sem token
      const response = await api.post('/usuarios/register', usuario); // Sem headers de autorização

      if (response.status === 200) {
        setSnackbarMessage('Usuário cadastrado com sucesso!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setCpfCnpj('');
        setNome('');
        setSobrenome('');
        setRazaoSocial('');
        setSenha('');
        setConfirmarSenha('');
        setTipoUsuario('1');
        setMatricula('');
        setTipoPessoa('fisica');
        setSetorSelecionado('');
      }
    } catch (error) {
            // OBSERVABLIDADE: log de erro detalhado
      console.error('Erro ao cadastrar usuário:', error.response || error.message);
      setSnackbarMessage('Erro ao cadastrar usuário. Verifique os campos e tente novamente.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    // Carregar lista de setores
    const fetchSetores = async () => {
      try {
        const response = await api.get('/setores');  // Sem token de autorização
        setSetores(response.data);
      } catch (error) {
        // Observabilidade: log de erro ao carregar setores
        console.error('Erro ao carregar setores:', error.response || error.message);
      }
    };
  
    if (tipoUsuario === '2') {  //Se for func. -> carrega os setores
      fetchSetores();
    }
  }, [tipoUsuario]);
  


  return (
    <Container maxWidth="sm" sx={{ maxHeight: '80vh', overflowY: 'auto', paddingBottom: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4, maxHeight: '100%', overflowY: 'auto' }}>
        <Typography variant="h4" gutterBottom color="primary">
          Cadastro de Usuário
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Tipo de Pessoa */}
          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">Tipo de Pessoa</FormLabel>
            <RadioGroup value={tipoPessoa} onChange={(e) => setTipoPessoa(e.target.value)} row>
              <FormControlLabel value="fisica" control={<Radio />} label="Pessoa Física" />
              <FormControlLabel value="juridica" control={<Radio />} label="Pessoa Jurídica" />
            </RadioGroup>
          </FormControl>

          {tipoPessoa === 'fisica' && (
            <>
              {/* Tipo de Usuário (somente aparece quando for pessoa física) */}
              <FormControl component="fieldset" margin="normal" fullWidth>
                <FormLabel component="legend">Tipo de Usuário</FormLabel>
                <RadioGroup value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)} row>
                  <FormControlLabel value="1" control={<Radio />} label="Usuário" />
                  <FormControlLabel value="2" control={<Radio />} label="Funcionário" />
                </RadioGroup>
              </FormControl>
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

              {tipoUsuario === '2' && (
                <>
                  <TextField
                    label="Matrícula"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={matricula}
                    onChange={(e) => setMatricula(limparFormato(e.target.value))}
                    inputProps={{ maxLength: 11 }}
                    required
                  />

                  <FormControl fullWidth margin="normal">
                    <FormLabel>Setor</FormLabel>
                    <TextField
                      select
                      value={setorSelecionado}
                      onChange={(e) => setSetorSelecionado(e.target.value)}
                      required
                    >
                      <MenuItem value="">Selecione um Setor</MenuItem>
                      {setores.map((setor) => (
                        <MenuItem key={setor.id} value={setor.id}>
                          {setor.nome}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>

                </>
              )}

              <TextField
                label="CPF"
                variant="outlined"
                fullWidth
                margin="normal"
                value={cpfCnpj}
                onChange={handleCpfCnpjChange}
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
                label="Razão Social"
                variant="outlined"
                fullWidth
                margin="normal"
                value={razaoSocial}
                onChange={(e) => setRazaoSocial(e.target.value)}
                required
              />

              <TextField
                label="CNPJ"
                variant="outlined"
                fullWidth
                margin="normal"
                value={cpfCnpj}
                onChange={handleCpfCnpjChange}
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
