import React, { useState, useEffect } from 'react';
import { Container, TextField, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Button, Typography, MenuItem, Select, InputLabel, Paper, Snackbar, Alert, Input } from '@mui/material';
import api from '../services/api';

const CadastroProcesso = () => {
  const [nome, setNome] = useState('');
  const [tipoPessoa, setTipoPessoa] = useState('física');
  const [cpf, setCpf] = useState('');
  const [tipoProcesso, setTipoProcesso] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tiposProcesso, setTiposProcesso] = useState([]);
  const [arquivo, setArquivo] = useState(null); // Novo estado para o arquivo

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchTiposProcesso();
  }, []);

  const fetchTiposProcesso = async () => {
    try {
      const response = await api.get('/tiposprocessos');
      setTiposProcesso(response.data);
    } catch (error) {
      console.error('Erro ao buscar tipos de processos:', error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const formatarCpfCnpj = (valor) => {
    valor = valor.replace(/\D/g, '');

    if (tipoPessoa === 'física' && valor.length <= 11) {
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else if (tipoPessoa === 'jurídica' && valor.length <= 14) {
      valor = valor.replace(/(\d{2})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d)/, '$1/$2');
      valor = valor.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }

    return valor;
  };

  const handleCpfChange = (event) => {
    const valorFormatado = formatarCpfCnpj(event.target.value);
    setCpf(valorFormatado);
  };

  const handleArquivoChange = (event) => {
    setArquivo(event.target.files[0]); // Armazena o arquivo selecionado
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('usuario', nome);
    formData.append('tipoPessoa', tipoPessoa);
    formData.append('cpf', cpf.replace(/\D/g, ''));
    formData.append('tipoProcesso', JSON.stringify({ id: tipoProcesso }));
    formData.append('descricao', descricao);
    if (arquivo) {
      formData.append('arquivo', arquivo); // Anexa o arquivo ao FormData
    }

    try {
      await api.post('/processos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSnackbarMessage('Processo criado com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setNome('');
      setTipoPessoa('física');
      setCpf('');
      setTipoProcesso('');
      setDescricao('');
      setArquivo(null); // Limpa o estado do arquivo
    } catch (error) {
      console.error('Erro ao criar processo:', error);
      setSnackbarMessage('Erro ao criar processo. Verifique os campos e tente novamente.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Cadastro de Processo
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome do Usuário"
            variant="outlined"
            fullWidth
            margin="normal"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">Tipo de Pessoa</FormLabel>
            <RadioGroup
              value={tipoPessoa}
              onChange={(e) => setTipoPessoa(e.target.value)}
              row
            >
              <FormControlLabel value="física" control={<Radio />} label="Pessoa Física" />
              <FormControlLabel value="jurídica" control={<Radio />} label="Pessoa Jurídica" />
            </RadioGroup>
          </FormControl>

          <TextField
            label={tipoPessoa === 'física' ? 'CPF' : 'CNPJ'}
            variant="outlined"
            fullWidth
            margin="normal"
            value={cpf}
            onChange={handleCpfChange}
            required
          />

          <FormControl variant="outlined" fullWidth margin="normal" required>
            <InputLabel>Tipo de Processo</InputLabel>
            <Select
              value={tipoProcesso}
              onChange={(e) => setTipoProcesso(e.target.value)}
              label="Tipo de Processo"
            >
              {tiposProcesso.map((tipo) => (
                <MenuItem key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Descrição"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel shrink={true}>Anexar Documento</InputLabel>
            <Input
              id="arquivo"
              type="file"
              inputProps={{ accept: 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document' }}
              onChange={handleArquivoChange}
            />
          </FormControl>

          <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Enviar
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

export default CadastroProcesso;
