import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';
import api from '../services/api';

const CadastroTipoProcesso = () => {
  const [nome, setNome] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const tipoProcesso = { nome };

    try {
      await api.post('/tiposprocessos', tipoProcesso);
      alert('Tipo de Processo criado com sucesso!');
      setNome('');
    } catch (error) {
      console.error('Erro ao criar tipo de processo:', error);
      alert('Erro ao criar tipo de processo. Verifique os dados e tente novamente.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Cadastro de Tipo de Processo
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome do Tipo de Processo"
            variant="outlined"
            fullWidth
            margin="normal"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Enviar
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CadastroTipoProcesso;
