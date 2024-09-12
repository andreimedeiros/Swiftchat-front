import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';

const ListaProcessos = () => {
  const [processos, setProcessos] = useState([]);
  const [userType, setUserType] = useState(''); // Estado para armazenar o tipo de usuário

  useEffect(() => {
    // Pegue o tipo de usuário do localStorage
    const storedUserType = localStorage.getItem('userType');
    setUserType(storedUserType);

    fetchProcessos();
  }, []);

  const fetchProcessos = async () => {
    try {
      // Faz a chamada à API, incluindo o token de autorização
      const response = await api.get('/processos', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Insere o token no header
        },
      });
      setProcessos(response.data);
    } catch (error) {
      console.error('Erro ao buscar processos:', error);
    }
  };

  const handleEdit = (id) => {
    console.log('Editar processo com ID:', id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/processos/${id}`);
      setProcessos(processos.filter(processo => processo.id !== id));
      console.log('Excluir processo com ID:', id);
    } catch (error) {
      console.error('Erro ao excluir processo:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          {/* Exibe o título conforme o tipo de usuário */}
          {userType === 'USUARIO' ? 'Meus Processos' : 'Todos os Processos'}
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Número do Processo</TableCell> {/* Coluna para o número do processo */}
                <TableCell>Setor Atual</TableCell>
                <TableCell>Tipo de Processo</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {processos.map((processo) => (
                <TableRow key={processo.id}>
                  <TableCell>{processo.nome}</TableCell>
                  <TableCell>{processo.numeroProcesso}</TableCell> {/* Exibe o número do processo */}
                  <TableCell>{processo.setor ? processo.setor.nome : 'Setor Intermediário'}</TableCell>
                  <TableCell>{processo.tipoProcesso ? processo.tipoProcesso.nome : ''}</TableCell>
                  <TableCell>{processo.descricao}</TableCell>
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
      </Paper>
    </Container>
  );
};

export default ListaProcessos;
