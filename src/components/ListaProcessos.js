import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import api from '../services/api';

const ListaProcessos = () => {
  const [processos, setProcessos] = useState([]);
  const [userType, setUserType] = useState('');
  const [userSetor, setUserSetor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [processoToDelete, setProcessoToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    setUserType(storedUserType);

    fetchUserSetor();
    fetchProcessos();
  }, []);

  const fetchUserSetor = async () => {
    try {
      const response = await api.get('/usuarios/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUserSetor(response.data.setor.nome); // Atualize conforme a estrutura de dados
    } catch (error) {
      console.error('Erro ao buscar setor do usuário:', error);
    }
  };

  const fetchProcessos = async () => {
    try {
      const response = await api.get('/processos', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProcessos(response.data);
    } catch (error) {
      console.error('Erro ao buscar processos:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/processos/${id}`);
      setProcessos(processos.filter((processo) => processo.id !== id));
      handleCloseDeleteDialog(); // Fecha o diálogo após a exclusão
    } catch (error) {
      console.error('Erro ao excluir processo:', error);
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await api.get(`/processos/${id}/download-todos-arquivos`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'arquivos_processo.zip'); // Nome do arquivo ZIP
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
    }
  };

  const handleAvaliar = (id) => {
    navigate(`/avaliar-processo/${id}`);
  };

  const handleEditar = (id) => {
    navigate(`/editar-processo/${id}`); // Redireciona para a página de edição de processo
  };

  const handleOpenDeleteDialog = (processo) => {
    setProcessoToDelete(processo);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProcessoToDelete(null);
  };

  const filteredProcessos = processos.filter((processo) =>
    processo.numeroProcesso?.toString().includes(searchTerm)
  );

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', paddingBottom: 10, marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom color="primary">
          {userType === 'USUARIO' ? 'Meus Processos' : 'Todos os Processos'}
        </Typography>

        <TextField
          label="Buscar Processo pelo Número"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Nome</TableCell>
                <TableCell style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Número do Processo</TableCell>
                <TableCell style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Setor Atual</TableCell>
                <TableCell style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Tipo de Processo</TableCell>
                <TableCell style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Descrição</TableCell>
                <TableCell style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Observação</TableCell> {/* Nova coluna */}
                <TableCell style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProcessos.map((processo) => (
                <TableRow key={processo.id}>
                  <TableCell>{processo.nome}</TableCell>
                  <TableCell>{processo.numeroProcesso}</TableCell>
                  <TableCell>{processo.setor ? processo.setor.nome : 'Setor Intermediario'}</TableCell>
                  <TableCell>{processo.tipoProcesso ? processo.tipoProcesso.nome : ''}</TableCell>
                  <TableCell>{processo.descricao}</TableCell>
                  <TableCell>{processo.statusProcesso ? processo.statusProcesso : 'Em trâmite'}</TableCell>
                  <TableCell>
                    {processo.statusProcesso === 'Indeferido' ? processo.observacao : 'N/A'}
                  </TableCell> {/* Exibe observação se for Indeferido */}
                  <TableCell>
                    {userType === 'FUNCIONARIO' && userSetor !== 'Setor Intermediario' && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleAvaliar(processo.id)}
                        sx={{ marginRight: 1 }}
                      >
                        Avaliar
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(processo.id)}
                    >
                      Download
                    </Button>

                    {userType === 'USUARIO' && (
                      <>
                        <Button
                          variant="outlined"
                          color="info"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditar(processo.id)}
                        >
                          Editar
                        </Button>

                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleOpenDeleteDialog(processo)}
                        >
                          Excluir
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredProcessos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Nenhum processo encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir o processo "{processoToDelete?.nome}"? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => handleDelete(processoToDelete?.id)} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ListaProcessos;
