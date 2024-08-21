import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';

const ListaTiposProcessos = () => {
  const [tiposProcessos, setTiposProcessos] = useState([]);

  useEffect(() => {
    fetchTiposProcessos();
  }, []);

  const fetchTiposProcessos = async () => {
    try {
      const response = await api.get('/tiposprocessos');
      setTiposProcessos(response.data);
    } catch (error) {
      console.error('Erro ao buscar tipos de processos:', error);
    }
  };

  const handleEdit = (id) => {
    console.log('Editar tipo de processo com ID:', id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tiposprocessos/${id}`);
      setTiposProcessos(tiposProcessos.filter(tipo => tipo.id !== id));
      console.log('Excluir tipo de processo com ID:', id);
    } catch (error) {
      console.error('Erro ao excluir tipo de processo:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Tipos de processos disponíveis
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tipo de Processo</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tiposProcessos.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell>{tipo.nome}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(tipo.id)}
                      sx={{ marginRight: 1 }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(tipo.id)}
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

export default ListaTiposProcessos;
