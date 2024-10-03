import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import api from '../services/api';

// Função para retry automático
const retryRequest = async (apiCall, maxRetries = 3) => {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      const response = await apiCall();
      return response; // TOLERÂNCIA A FALHAS: Se a requisicao der certo, retorna o resultado
    } catch (error) {
      attempts++;
      if (attempts >= maxRetries) throw error; // TOLERÂNCIA A FALHAS: Se passar dos n de tentativas, joga o erro
    }
  }
};

const CadastroProcesso = ({ onSubmit = () => {} }) => {
  const [tiposProcesso, setTiposProcesso] = useState([]);
  const [tipoProcesso, setTipoProcesso] = useState('');
  const [nome, setNome] = useState(''); 
  const [descricao, setDescricao] = useState('');
  const [arquivos, setArquivos] = useState([]); 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // TOLERÂNCIA A FALHAS: timeout global para requisições
  const apiInstance = api.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 5000,  // Timeout 
  });

  useEffect(() => {
    const fetchTiposProcesso = async () => {
      try {
        const response = await retryRequest(() => api.get('/tiposprocessos'));
        setTiposProcesso(response.data);
      } catch (error) {
        setSnackbarMessage('Erro ao carregar tipos de processo. Verifique sua conexão.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        console.error('Erro ao buscar tipos de processo:', error);
      }
    };

    fetchTiposProcesso();
  }, []);

  const handleArquivosChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`O arquivo ${file.name} excede o tamanho máximo de 5 MB.`);
        return false;
      }
      if (file.type !== 'application/pdf') {
        alert(`Apenas arquivos PDF são permitidos (${file.name}).`);
        return false;
      }
      return true;
    });

    setArquivos(validFiles);
  };

  const handleCadastro = async () => {
    if (nome && tipoProcesso && descricao && arquivos.length > 0) {
      try {
        const formData = new FormData();
        formData.append('processo', new Blob([JSON.stringify({
          nome,
          descricao,
          tipoProcesso: { id: tipoProcesso },
        })], { type: 'application/json' }));
        
        arquivos.forEach((arquivo) => formData.append('arquivos', arquivo)); 

        // TOLERÂNCIA A FALHAS: Retry automAtico na requisição de cadastro
        const response = await retryRequest(() => apiInstance.post('/processos', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }));

        if (response.status === 200) {
          setNome('');
          setDescricao('');
          setTipoProcesso('');
          setArquivos([]);

          setSnackbarMessage('Processo cadastrado com sucesso!');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);

          if (typeof onSubmit === 'function') {
            onSubmit(response.data);
          }
        }
      } catch (error) {
        console.error('Erro ao cadastrar processo:', error);
        setSnackbarMessage('Erro ao cadastrar processo. Verifique sua conexão ou tente novamente mais tarde.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } else {
      setSnackbarMessage('Por favor, preencha todos os campos e anexe pelo menos um arquivo.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      handleCadastro();
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, marginBottom: 4, overflowY: 'auto' }}>
      <Typography variant="h5" align="center" gutterBottom>
        Cadastro de Processo
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ maxHeight: '75vh', overflowY: 'auto', paddingBottom: 2 }}
      >
        {/* Campos do formulário */}
        <TextField
          label="Nome do Processo"
          variant="outlined"
          fullWidth
          margin="normal"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="tipo-processo-label">Tipo de Processo</InputLabel>
          <Select
            labelId="tipo-processo-label"
            value={tipoProcesso}
            onChange={(e) => setTipoProcesso(e.target.value)}
            onKeyDown={handleKeyDown}
          >
            {tiposProcesso.map(tipo => (
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
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <FormControl fullWidth margin="normal">
          Anexar Documentos (PDF)
          <input
            id="arquivos"
            type="file"
            accept="application/pdf"
            onChange={handleArquivosChange}
            multiple
            onKeyDown={handleKeyDown}
          />
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleCadastro} sx={{ marginTop: 2 }}>
          Cadastrar Processo
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CadastroProcesso;
