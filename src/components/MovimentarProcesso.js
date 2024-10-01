import React, { useState, useEffect } from 'react';
import { Container, Typography, FormControl, Button, Paper, Snackbar, Alert, TextField, Autocomplete } from '@mui/material';
import api from '../services/api';

const MovimentarProcesso = () => {
  const [processos, setProcessos] = useState([]);
  const [processoSelecionado, setProcessoSelecionado] = useState(null); // Agora será um objeto, não apenas o ID
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
      if (!processoSelecionado || !setorDestino) {
        setSnackbarMessage('Selecione um processo e um setor destino.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      await api.put(`/processos/${processoSelecionado.id}/setor/${setorDestino}`);

      // Atualiza a lista de processos após a movimentação
      fetchProcessos();

      setSnackbarMessage('Processo movimentado com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setProcessoSelecionado(null);
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

        {/* Possui Autocomplete para buscar pelo número do processo */}
        <FormControl variant="outlined" fullWidth margin="normal" required>
          <Autocomplete
            options={processos}
            getOptionLabel={(processo) => `Processo Nº ${processo.numeroProcesso} (Setor atual: ${processo.setor ? processo.setor.nome : 'Intermediário'})`}
            value={processoSelecionado}
            onChange={(event, newValue) => setProcessoSelecionado(newValue)}
            renderInput={(params) => <TextField {...params} label="Selecione o Processo" variant="outlined" />}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>

        {/* Setor destino */}
        <FormControl variant="outlined" fullWidth margin="normal" required>
          <TextField
            select
            label="Selecione o Setor Destino"
            value={setorDestino}
            onChange={(e) => setSetorDestino(e.target.value)}
            SelectProps={{
              native: true,
            }}
          >
            <option value=""></option>
            {setores.map((setor) => (
              <option key={setor.id} value={setor.id}>
                {setor.nome}
              </option>
            ))}
          </TextField>
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
