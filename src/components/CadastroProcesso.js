import React, { useState } from 'react';
import { Container, TextField, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Checkbox, Button, Typography } from '@mui/material';

const CadastroProcesso = () => {
  const [nome, setNome] = useState('');
  const [tipoPessoa, setTipoPessoa] = useState('fisica');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui você pode adicionar a lógica para enviar os dados do formulário
    console.log({ nome, tipoPessoa, cpfCnpj, mensagem });
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

// import React, { useState } from 'react';
// import { Container, TextField, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Button, Typography } from '@mui/material';

// const CadastroProcesso = () => {
//   const [nome, setNome] = useState('');
//   const [tipoPessoa, setTipoPessoa] = useState('fisica');
//   const [cpfCnpj, setCpfCnpj] = useState('');
//   const [mensagem, setMensagem] = useState('');

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const processo = {
//       nome,
//       tipoPessoa,
//       cpfCnpj,
//       mensagem,
//     };

//     try {
//       const response = await fetch('http://localhost:8080/api/processos/cadastrar', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(processo),
//       });

//       if (response.ok) {
//         const result = await response.text();
//         alert('Processo cadastrado com sucesso: ' + result);
//       } else {
//         alert('Erro ao cadastrar o processo');
//       }
//     } catch (error) {
//       console.error('Erro:', error);
//       alert('Erro ao cadastrar o processo');
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Typography variant="h4" gutterBottom>
//         Cadastro de Processo
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           label="Nome do Usuário"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           value={nome}
//           onChange={(e) => setNome(e.target.value)}
//           required
//         />
        
//         <FormControl component="fieldset" margin="normal" required>
//           <FormLabel component="legend">Tipo de Pessoa</FormLabel>
//           <RadioGroup
//             value={tipoPessoa}
//             onChange={(e) => setTipoPessoa(e.target.value)}
//             row
//           >
//             <FormControlLabel value="fisica" control={<Radio />} label="Pessoa Física" />
//             <FormControlLabel value="juridica" control={<Radio />} label="Pessoa Jurídica" />
//           </RadioGroup>
//         </FormControl>
        
//         <TextField
//           label={tipoPessoa === 'fisica' ? 'CPF' : 'CNPJ'}
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           value={cpfCnpj}
//           onChange={(e) => setCpfCnpj(e.target.value)}
//           required
//         />

//         <TextField
//           label="Mensagem"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           multiline
//           rows={4}
//           value={mensagem}
//           onChange={(e) => setMensagem(e.target.value)}
//           required
//         />

//         <Button type="submit" variant="contained" color="primary">
//           Enviar
//         </Button>
//       </form>
//     </Container>
//   );
// };

// export default CadastroProcesso;
