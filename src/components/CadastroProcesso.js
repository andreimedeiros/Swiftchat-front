import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const CadastroProcesso = ({ onSubmit }) => {
  const [tiposProcesso, setTiposProcesso] = useState([]);
  const [tipoProcesso, setTipoProcesso] = useState('');
  const [descricao, setDescricao] = useState('');

  // Função para buscar os tipos de processo do backend
  useEffect(() => {
    const fetchTiposProcesso = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/tiposProcesso');  // Supondo que exista um endpoint para buscar os tipos de processo
        setTiposProcesso(response.data);
      } catch (error) {
        console.error('Erro ao buscar tipos de processo:', error);
      }
    };

    fetchTiposProcesso();
  }, []);

  const handleCadastro = async () => {
    if (tipoProcesso && descricao) {
      try {
        // Criando o objeto Processo conforme esperado pelo backend
        const processo = {
          tipoProcesso: { id: tipoProcesso },
          descricao,
        };

        // Submetendo o processo para o backend
        const response = await axios.post('http://localhost:8080/api/processos', processo, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,  // Supondo que o token JWT está sendo armazenado no localStorage
          },
        });

        if (response.status === 200) {
          alert('Processo cadastrado com sucesso!');
          onSubmit(response.data); // Caso haja necessidade de alguma ação após o cadastro
        }
      } catch (error) {
        console.error('Erro ao cadastrar processo:', error);
        alert('Erro ao cadastrar processo. Por favor, tente novamente.');
      }
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Cadastro de Processo
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center">
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
        <Button variant="contained" color="primary" onClick={handleCadastro} sx={{ marginTop: 2 }}>
          Cadastrar Processo
        </Button>
      </Box>
    </Paper>
  );
};

export default CadastroProcesso;
