// src/components/ListaProcessos.js
import React, { useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ListaProcessos = () => {
  const [processos, setProcessos] = useState([
    { id: 1, nome: 'João Silva', tipoPessoa: 'física', cpfCnpj: '123.456.789-00', mensagem: 'Solicitação de processo X' },
    { id: 2, nome: 'Empresa ABC', tipoPessoa: 'jurídica', cpfCnpj: '12.345.678/0001-99', mensagem: 'Solicitação de processo Y' },
   
  ]);

  const handleEdit = (id) => {
    console.log('Editar processo com ID:', id);
  
  };

  const handleDelete = (id) => {
    setProcessos(processos.filter(processo => processo.id !== id));
    console.log('Excluir processo com ID:', id);
    
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Lista de Processos
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Tipo de Pessoa</TableCell>
              <TableCell>CPF/CNPJ</TableCell>
              <TableCell>Tipo de Processo</TableCell>
              <TableCell>Mensagem</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processos.map((processo) => (
              <TableRow key={processo.id}>
                <TableCell>{processo.nome}</TableCell>
                <TableCell>{processo.tipoPessoa}</TableCell>
                <TableCell>{processo.cpfCnpj}</TableCell>
                <TableCell>{processo.tipo}</TableCell>
                <TableCell>{processo.mensagem}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(processo.id)}
                    style={{ marginRight: 8 }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(processo.id)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ListaProcessos;
