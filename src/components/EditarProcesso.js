import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, FormControl, Snackbar, Alert } from '@mui/material';
import api from '../services/api';
import { useParams } from 'react-router-dom';

const EditarProcesso = () => {
  const { id } = useParams();
  const [setProcesso] = useState({});
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [novosArquivos, setNovosArquivos] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 

  useEffect(() => {
    fetchProcesso();
  }, []);

  const fetchProcesso = async () => {
    try {
      const response = await api.get(`/processos/${id}`);
      setProcesso(response.data);
      setNome(response.data.nome);
      setDescricao(response.data.descricao);
    } catch (error) {
      console.error('Erro ao buscar processo:', error);
    }
  };

  const handleNovosArquivosChange = (event) => {
    setNovosArquivos(event.target.files);
  };

  const handleEditarProcesso = async () => {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);

    for (let i = 0; i < novosArquivos.length; i++) {
      formData.append('novosArquivos', novosArquivos[i]);
    }

    try {
      const response = await api.put(`/processos/${id}/anexar`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setSnackbarMessage('Processo atualizado com sucesso!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Erro ao editar processo.');
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
        Editar Processo
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ maxHeight: '75vh', overflowY: 'auto', paddingBottom: 2 }}
      >
        <TextField
          label="Nome do Processo"
          variant="outlined"
          fullWidth
          margin="normal"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <TextField
          label="Descrição"
          variant="outlined"
          fullWidth
          margin="normal"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          Anexar Novos Documentos
          <input
            type="file"
            accept="application/pdf"
            onChange={handleNovosArquivosChange}
            multiple
          />
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleEditarProcesso} sx={{ marginTop: 2 }}>
          Salvar Alterações
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

export default EditarProcesso;
