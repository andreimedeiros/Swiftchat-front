import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Paper, FormControl, RadioGroup, FormControlLabel, Radio, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const AvaliarProcesso = () => {
  const { id } = useParams(); // Pega o ID do processo da URL
  const [processo, setProcesso] = useState({});
  const [status, setStatus] = useState('');
  const [observacao, setObservacao] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProcesso();
  }, []);

  const fetchProcesso = async () => {
    try {
      const response = await api.get(`/processos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProcesso(response.data);
      setStatus(response.data.statusProcesso || 'Em tramitação');
      setObservacao(response.data.observacao || '');
    } catch (error) {
      console.error('Erro ao buscar processo:', error);
    }
  };

  const handleAvaliar = async () => {
    try {
      const response = await api.put(`/processos/${id}/status`, 
      {
        statusProcesso: status,
        observacao: status === 'Indeferido' ? observacao : null,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setSnackbarMessage('Processo avaliado com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Redireciona para a lista de processos após 2 segundos
      setTimeout(() => navigate('/list'), 2000);
    } catch (error) {
      console.error('Erro ao avaliar o processo:', error);
      setSnackbarMessage('Erro ao avaliar processo.');
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
          Avaliar Processo
        </Typography>

        <Typography variant="h6" gutterBottom>
          Nome: {processo.nome}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Número do Processo: {processo.numeroProcesso}
        </Typography>

        <FormControl component="fieldset" margin="normal" fullWidth>
          <Typography variant="h6">Status do Processo:</Typography>
          <RadioGroup value={status} onChange={(e) => setStatus(e.target.value)}>
            <FormControlLabel value="Deferido" control={<Radio />} label="Deferido" />
            <FormControlLabel value="Indeferido" control={<Radio />} label="Indeferido" />
          </RadioGroup>
        </FormControl>

        {status === 'Indeferido' && (
          <TextField
            label="Observação"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            required={status === 'Indeferido'}
          />
        )}

        <Button variant="contained" color="primary" onClick={handleAvaliar} sx={{ marginTop: 2 }}>
          Avaliar
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

export default AvaliarProcesso;
