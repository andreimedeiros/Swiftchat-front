import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, RadioGroup, FormControlLabel, Radio, Snackbar, Alert } from '@mui/material';
import InputMask from 'react-input-mask';

const CadastroUsuario = ({ onClose }) => {
  const [tipoPessoa, setTipoPessoa] = useState('FISICA');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [password, setPassword] = useState('');
  const [tipoConta, setTipoConta] = useState('USUARIO');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleTipoPessoaChange = (event) => {
    setTipoPessoa(event.target.value);
    setCpfCnpj(''); // Reseta o CPF/CNPJ quando o tipo de pessoa é alterado
  };

  const handleTipoContaChange = (event) => {
    setTipoConta(event.target.value);
    if (event.target.value === 'FUNCIONARIO') {
      setTipoPessoa('FISICA'); // Funcionários só podem ser Pessoa Física
    }
  };

  const handleCadastro = async () => {
    // Remove formatação de CPF/CNPJ
    const cpfCnpjSemFormatacao = cpfCnpj.replace(/\D/g, '');

    if (cpfCnpjSemFormatacao.length < 11 || (tipoPessoa === 'JURIDICA' && cpfCnpjSemFormatacao.length < 14)) {
      alert('Por favor, preencha o CPF/CNPJ corretamente.');
      return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/usuarios/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome,
                sobrenome,
                cpf: tipoPessoa === 'FISICA' ? cpfCnpjSemFormatacao : null,
                cnpj: tipoPessoa === 'JURIDICA' ? cpfCnpjSemFormatacao : null,
                password,
                tipoUsuario: tipoConta === 'USUARIO' ? 1 : 2,
                tipoPessoa,
            }),
        });

        if (response.ok) {
            setOpenSnackbar(true);
            setTimeout(() => {
                setOpenSnackbar(false);
                onClose(); // Fechar o modal após o cadastro
            }, 3000); // Fecha o Snackbar após 3 segundos
        } else {
            const errorData = await response.json();
            alert(`Erro ao cadastrar: ${errorData.message}`);
        }
    } catch (error) {
        alert(`Erro ao cadastrar: ${error.message}`);
    }
};


  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Paper elevation={3} sx={{ padding: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Cadastro de Usuário/Funcionário
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center">
        <RadioGroup
          row
          value={tipoConta}
          onChange={handleTipoContaChange}
          sx={{ marginBottom: 2 }}
        >
          <FormControlLabel value="USUARIO" control={<Radio />} label="Usuário" />
          <FormControlLabel value="FUNCIONARIO" control={<Radio />} label="Funcionário" />
        </RadioGroup>

        <RadioGroup
          row
          value={tipoPessoa}
          onChange={handleTipoPessoaChange}
          sx={{ marginBottom: 2 }}
        >
          <FormControlLabel value="FISICA" control={<Radio />} label="Pessoa Física" />
          <FormControlLabel value="JURIDICA" control={<Radio />} label="Pessoa Jurídica" disabled={tipoConta === 'FUNCIONARIO'} />
        </RadioGroup>

        <InputMask
          mask={tipoPessoa === 'FISICA' ? '999.999.999-99' : '99.999.999/9999-99'}
          value={cpfCnpj}
          onChange={(e) => setCpfCnpj(e.target.value)}
        >
          {() => <TextField label={tipoPessoa === 'FISICA' ? "CPF" : "CNPJ"} variant="outlined" fullWidth margin="normal" />}
        </InputMask>

        <TextField
          label="Nome"
          variant="outlined"
          fullWidth
          margin="normal"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <TextField
          label="Sobrenome"
          variant="outlined"
          fullWidth
          margin="normal"
          value={sobrenome}
          onChange={(e) => setSobrenome(e.target.value)}
        />

        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button variant="contained" color="primary" onClick={handleCadastro} sx={{ marginTop: 2 }}>
          Cadastrar
        </Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Cadastro realizado com sucesso!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CadastroUsuario;
