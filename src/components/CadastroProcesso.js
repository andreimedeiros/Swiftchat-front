import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import api from '../services/api';

const CadastroProcesso = ({ onSubmit = () => {} }) => {
  const [tiposProcesso, setTiposProcesso] = useState([]);
  const [tipoProcesso, setTipoProcesso] = useState('');
  const [nome, setNome] = useState(''); 
  const [descricao, setDescricao] = useState('');
  const [arquivo, setArquivo] = useState(null);
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

  const handleArquivoChange = (event) => {
    setArquivo(event.target.files[0]);
  };

  const handleCadastro = async () => {
    if (nome && tipoProcesso && descricao) {
      try {
        const processData = {
          nome,
          descricao,
          tipoProcesso: {
            id: tipoProcesso,
          },
        };

        const response = await api.post('/processos', processData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
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
      setSnackbarMessage('Por favor, preencha todos os campos e anexe o arquivo.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ padding: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Cadastro de Processo
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center">
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
          Anexar Documento
          <InputLabel shrink={true}></InputLabel>
          <input
            id="arquivo"
            type="file"
            accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleArquivoChange}
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
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} x={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CadastroProcesso;
