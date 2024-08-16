import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import api from '../services/api';

const MovimentarProcesso = () => {
  const [processoId, setProcessoId] = useState('');
  const [setorDestinoId, setSetorDestinoId] = useState('');
  const [processos, setProcessos] = useState([]);
  const [setores, setSetores] = useState([]);

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

  const handleSubmit = async () => {
    try {
      await api.put(`/processos/${processoId}/setor/${setorDestinoId}`);
      alert('Processo movido com sucesso!');
    } catch (error) {
      console.error('Erro ao mover processo:', error);
      alert('Erro ao mover processo. Verifique os dados e tente novamente.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Movimentar Processos
        </Typography>
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Processo</InputLabel>
          <Select
            value={processoId}
            onChange={(e) => setProcessoId(e.target.value)}
            label="Processo"
          >
            {processos.map((processo) => (
              <MenuItem key={processo.id} value={processo.id}>
                {processo.nome} - {processo.cpf}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Setor de Destino</InputLabel>
          <Select
            value={setorDestinoId}
            onChange={(e) => setSetorDestinoId(e.target.value)}
            label="Setor de Destino"
          >
            {setores.map((setor) => (
              <MenuItem key={setor.id} value={setor.id}>
                {setor.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ marginTop: 2 }}
        >
          Movimentar
        </Button>
      </Paper>
    </Container>
  );
};

export default MovimentarProcesso;
