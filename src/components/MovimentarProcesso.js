import React, { useState, useEffect } from 'react';
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, Button, Paper, Snackbar, Alert } from '@mui/material';
import api from '../services/api';

const MovimentarProcesso = () => {
  const [processos, setProcessos] = useState([]);
  const [processoSelecionado, setProcessoSelecionado] = useState('');
  const [setores, setSetores] = useState([]);
  const [setorDestino, setSetorDestino] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchProcessos();
    fetchSetores();
  }, []);

  const fetchProcessos = async () => {
    try {
      const response = await api.get('/processos');
      setProcessos(response.data);
    } catch (error) {
      console.error('Erro ao buscar processos:', error);
    }
  };

  const fetchSetores = async () => {
    try {
      const response = await api.get('/setores');
      setSetores(response.data);
    } catch (error) {
      console.error('Erro ao buscar setores:', error);
    }
  };

  const handleMovimentar = async () => {
    try {
      await api.put(`/processos/${processoSelecionado}/setor/${setorDestino}`);
      setSnackbarMessage('Processo movimentado com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setProcessoSelecionado('');
      setSetorDestino('');
    } catch (error) {
      console.error('Erro ao movimentar processo:', error);
      setSnackbarMessage('Erro ao movimentar processo.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Movimentar Processo
        </Typography>
        <FormControl variant="outlined" fullWidth margin="normal" required>
          <InputLabel>Selecione o Processo</InputLabel>
          <Select
            value={processoSelecionado}
            onChange={(e) => setProcessoSelecionado(e.target.value)}
            label="Selecione o Processo"
          >
            {processos.map((processo) => (
              <MenuItem key={processo.id} value={processo.id}>
                {`Processo Nº ${processo.numeroProcesso} (Setor atual: ${processo.setor ? processo.setor.nome : 'Intermediário'})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" fullWidth margin="normal" required>
          <InputLabel>Selecione o Setor Destino</InputLabel>
          <Select
            value={setorDestino}
            onChange={(e) => setSetorDestino(e.target.value)}
            label="Selecione o Setor Destino"
          >
            {setores.map((setor) => (
              <MenuItem key={setor.id} value={setor.id}>
                {setor.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleMovimentar} sx={{ marginTop: 2 }}>
          Movimentar
        </Button>
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

export default MovimentarProcesso;
