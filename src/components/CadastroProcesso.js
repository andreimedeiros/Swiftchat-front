import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import api from '../services/api';

const CadastroProcesso = ({ onSubmit = () => {} }) => {
  const [tiposProcesso, setTiposProcesso] = useState([]);
  const [tipoProcesso, setTipoProcesso] = useState('');
  const [nome, setNome] = useState(''); 
  const [descricao, setDescricao] = useState('');
  const [arquivos, setArquivos] = useState([]); // Alterado para múltiplos arquivos
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

  useEffect(() => {
    const fetchTiposProcesso = async () => {
      try {
        const response = await api.get('/tiposprocessos');
        setTiposProcesso(response.data);
      } catch (error) {
        console.error('Erro ao buscar tipos de processo:', error);
      }
    };

    fetchTiposProcesso();
  }, []);

  const handleArquivosChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    // Verificação de múltiplos arquivos
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
    if (nome && tipoProcesso && descricao && arquivos.length > 0) { // Verifica se múltiplos arquivos foram selecionados
      try {
        const formData = new FormData();
        formData.append('processo', new Blob([JSON.stringify({
          nome,
          descricao,
          tipoProcesso: { id: tipoProcesso },
        })], { type: 'application/json' }));
        
        arquivos.forEach((arquivo) => formData.append('arquivos', arquivo)); // Adiciona todos os arquivos ao FormData
    
        const response = await api.post('/processos', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
    
        if (response.status === 200) {
          // Limpa os campos após o cadastro
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
        setSnackbarMessage('Erro ao cadastrar processo. Por favor, tente novamente.');
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
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="tipo-processo-label">Tipo de Processo</InputLabel>
          <Select
            labelId="tipo-processo-label"
            value={tipoProcesso}
            onChange={(e) => setTipoProcesso(e.target.value)}
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
        />
        <FormControl fullWidth margin="normal">
          Anexar Documentos (PDF)
          <input
            id="arquivos"
            type="file"
            accept="application/pdf"
            onChange={handleArquivosChange}
            multiple // Permitir seleção múltipla de arquivos
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
