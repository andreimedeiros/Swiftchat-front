import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, TextField, Modal, Box, Snackbar, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';

const ListaSetores = () => {
  const [setores, setSetores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSetor, setCurrentSetor] = useState({ id: null, nome: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchSetores();
  }, []);

  const fetchSetores = async () => {
    try {
      const response = await api.get('/setores');
      setSetores(response.data);
    } catch (error) {
      console.error('Erro ao buscar setores:', error);
    }
  };

  const handleEdit = (setor) => {
    setCurrentSetor(setor);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/setores/${id}`);
      setSetores(setores.filter((setor) => setor.id !== id));
      setSnackbarMessage('Setor excluído com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao excluir setor:', error);
      setSnackbarMessage('Erro ao excluir setor. (Existem processos vinculados a este setor)');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleAdd = () => {
    setCurrentSetor({ id: null, nome: '' });
    setIsEditMode(false);
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (isEditMode) {
        await api.put(`/setores/${currentSetor.id}`, currentSetor);
        setSnackbarMessage('Setor editado com sucesso!');
      } else {
        await api.post('/setores', currentSetor);
        setSnackbarMessage('Setor adicionado com sucesso!');
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchSetores();
      setModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar setor:', error);
      setSnackbarMessage('Erro ao salvar setor.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Setores
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd} sx={{ marginBottom: 2 }}>
          Adicionar Setor
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome do Setor</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {setores.map((setor) => (
                <TableRow key={setor.id}>
                  <TableCell>{setor.nome}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(setor)}
                      sx={{ marginRight: 1 }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(setor.id)}
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

      {/* Modal para Adicionar/Editar Setor */}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {isEditMode ? 'Editar Setor' : 'Adicionar Setor'}
          </Typography>
          <TextField
            label="Nome do Setor"
            fullWidth
            value={currentSetor.nome}
            onChange={(e) => setCurrentSetor({ ...currentSetor, nome: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleSave}>
            Salvar
          </Button>
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ListaSetores;
