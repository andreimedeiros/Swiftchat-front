import React, { useState } from 'react';
import { Container, TextField, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Button, Typography, MenuItem, Select, InputLabel, Paper } from '@mui/material';
import api from '../services/api';

const CadastroProcesso = () => {
  const [nome, setNome] = useState('');
  const [tipoPessoa, setTipoPessoa] = useState('física');
  const [cpf, setCpf] = useState('');
  const [tipoProcesso, setTipoProcesso] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const processo = {
      nome,
      tipoPessoa,
      cpf,
      tipoProcesso: { id: tipoProcesso },
      descricao,
    };

    try {
      await api.post('/processos', processo);
      alert('Processo criado com sucesso!');
      setNome('');
      setTipoPessoa('física');
      setCpf('');
      setTipoProcesso('');
      setDescricao('');
    } catch (error) {
      console.error('Erro ao criar processo:', error);
      alert('CPF/CNPJ já utilizado em um processo. Aguarde a conclusão do mesmo.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Cadastro de Processo
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome do Usuário"
            variant="outlined"
            fullWidth
            margin="normal"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">Tipo de Pessoa</FormLabel>
            <RadioGroup
              value={tipoPessoa}
              onChange={(e) => setTipoPessoa(e.target.value)}
              row
            >
              <FormControlLabel value="física" control={<Radio />} label="Pessoa Física" />
              <FormControlLabel value="jurídica" control={<Radio />} label="Pessoa Jurídica" />
            </RadioGroup>
          </FormControl>

          <TextField
            label={tipoPessoa === 'física' ? 'CPF' : 'CNPJ'}
            variant="outlined"
            fullWidth
            margin="normal"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />

          <FormControl variant="outlined" fullWidth margin="normal" required>
            <InputLabel>Tipo de Processo</InputLabel>
            <Select
              value={tipoProcesso}
              onChange={(e) => setTipoProcesso(e.target.value)}
              label="Tipo de Processo"
            >
              <MenuItem value={1}>Licença de Resíduos Sólidos</MenuItem>
              <MenuItem value={2}>Licença Prévia</MenuItem>
              <MenuItem value={3}>Licença de Operação</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Descrição"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
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

export default CadastroProcesso;
