import React, { useState } from 'react';
import { Container, TextField, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Button, Typography, MenuItem, Select, InputLabel } from '@mui/material';

const CadastroProcesso = () => {
  const [nome, setNome] = useState('');
  const [tipoPessoa, setTipoPessoa] = useState('fisica');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [tipoProcesso, setTipoProcesso] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log({ nome, tipoPessoa, cpfCnpj, tipoProcesso, mensagem });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
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
        
        <FormControl component="fieldset" margin="normal" required>
          <FormLabel component="legend">Tipo de Pessoa</FormLabel>
          <RadioGroup
            value={tipoPessoa}
            onChange={(e) => setTipoPessoa(e.target.value)}
            row
          >
            <FormControlLabel value="fisica" control={<Radio />} label="Pessoa Física" />
            <FormControlLabel value="juridica" control={<Radio />} label="Pessoa Jurídica" />
          </RadioGroup>
        </FormControl>
        
        <TextField
          label={tipoPessoa === 'fisica' ? 'CPF' : 'CNPJ'}
          variant="outlined"
          fullWidth
          margin="normal"
          value={cpfCnpj}
          onChange={(e) => setCpfCnpj(e.target.value)}
          required
        />

        {/* Adicionando o menu de seleção de tipos de processo */}
        <FormControl variant="outlined" fullWidth margin="normal" required>
          <InputLabel>Tipo de Processo</InputLabel>
          <Select
            value={tipoProcesso}
            onChange={(e) => setTipoProcesso(e.target.value)}
            label="Tipo de Processo"
          >
            <MenuItem value="licenca_residuos_solidos">Licença de Resíduos Sólidos</MenuItem>
            <MenuItem value="licenca_previa">Licença Prévia</MenuItem>
            <MenuItem value="licenca_operacao">Licença de Operação</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Mensagem"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          required
        />

        <Button type="submit" variant="contained" color="primary">
          Enviar
        </Button>
      </form>
    </Container>
  );
};

export default CadastroProcesso;
