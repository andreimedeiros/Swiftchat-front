import React, { useState, useEffect } from 'react';
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, Button, Paper } from '@mui/material';
import api from '../services/api';

const MovimentarProcesso = () => {
  const [processos, setProcessos] = useState([]);
  const [processoSelecionado, setProcessoSelecionado] = useState('');
  const [setores, setSetores] = useState([]);
  const [setorDestino, setSetorDestino] = useState('');

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
      alert('Processo movimentado com sucesso!');
      setProcessoSelecionado('');
      setSetorDestino('');
    } catch (error) {
      console.error('Erro ao movimentar processo:', error);
      alert('Erro ao movimentar processo.');
    }
  };

  const formatarCpfCnpj = (valor) => {
    if (valor.length === 11) {
      return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (valor.length === 14) {
      return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return valor;
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
                {processo.nome} - {formatarCpfCnpj(processo.cpf)}
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
    </Container>
  );
};

export default MovimentarProcesso;
