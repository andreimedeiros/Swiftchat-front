import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const CadastroProcesso = ({ onSubmit }) => {
  const [tiposProcesso, setTiposProcesso] = useState([]);
  const [tipoProcesso, setTipoProcesso] = useState('');
  const [descricao, setDescricao] = useState('');
  const [arquivo, setArquivo] = useState(null);

  // Função para buscar os tipos de processo do backend
  useEffect(() => {
    const fetchTiposProcesso = async () => {
      try {
        const response = await axios.get('http://localhost:8080/tiposProcesso');  // Supondo que exista um endpoint para buscar os tipos de processo
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
    if (tipoProcesso && descricao && arquivo) {
      try {
        
        const formData = new FormData();
        formData.append('tipoProcesso', tipoProcesso);  // Adiciona o id do tipo de processo
        formData.append('descricao', descricao);  // Adiciona a descrição
        formData.append('arquivo', arquivo);  // Adiciona o arquivo selecionado

        // Submetendo o processo para o backend
        const response = await axios.post('http://localhost:8080/api/processos', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,  // Supondo que o token JWT está sendo armazenado no localStorage
            'Content-Type': 'multipart/form-data',  // Necessário ao enviar arquivos
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
      alert('Por favor, preencha todos os campos e anexe o arquivo.');
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
    </Paper>
  );
};

export default CadastroProcesso;
