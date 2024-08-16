import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';
import EditarProcesso from './EditarProcesso';

const ListaProcessos = () => {
  const [processos, setProcessos] = useState([]);
  const [selectedProcessoId, setSelectedProcessoId] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    fetchProcessos();
  }, []);

  const fetchProcessos = async () => {
    try {
      const response = await api.get('/processos');
      setProcessos(response.data);
    } catch (error) {
      console.error('Erro ao buscar processos:', error);
    }
  };

  const handleEdit = (id) => {
    setSelectedProcessoId(id);
    setOpenEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/processos/${id}`);
      setProcessos(processos.filter(processo => processo.id !== id));
    } catch (error) {
      console.error('Erro ao excluir processo:', error);
    }
  };

  const formatarCpfCnpj = (valor) => {
    if (valor.length === 11) {
      return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (valor.length === 14) {
      return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return valor;
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom color="primary">
        Lista de Processos
      </Typography>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CPF/CNPJ</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Setor Atual</TableCell>
                <TableCell>Tipo de Processo</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {processos.map((processo) => (
                <TableRow key={processo.id}>
                  <TableCell>{processo.nome}</TableCell>
                  <TableCell>{formatarCpfCnpj(processo.cpf)}</TableCell>
                  <TableCell>{processo.descricao}</TableCell>
                  <TableCell>{processo.setor ? processo.setor.nome : 'Setor Intermediário'}</TableCell>
                  <TableCell>{processo.tipoProcesso ? processo.tipoProcesso.nome : 'Não Definido'}</TableCell>
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
      <EditarProcesso
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        processoId={selectedProcessoId}
        refreshList={fetchProcessos}
      />
    </Container>
  );
};

export default ListaProcessos;
