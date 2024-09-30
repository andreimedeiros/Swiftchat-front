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
  TextField 
} from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import api from '../services/api';

const ListaProcessos = () => {
  const [processos, setProcessos] = useState([]);
  const [userType, setUserType] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de busca

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    setUserType(storedUserType);

    fetchProcessos();
  }, []);

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
      setProcessos(processos.filter(processo => processo.id !== id));
      console.log('Excluir processo com ID:', id);
    } catch (error) {
      console.error('Erro ao excluir processo:', error);
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await api.get(`/processos/${id}/download`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'arquivo.pdf';
      if (contentDisposition) {
        const matches = /filename="([^"]+)"/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          fileName = matches[1];
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
    }
  };

  const filteredProcessos = processos.filter(processo => {
    // Verifica se numeroProcesso existe e converte para string
    if (processo.numeroProcesso) {
      return processo.numeroProcesso.toString().includes(searchTerm);
    }
    return false;
  });

  return (
    <Container 
      maxWidth="lg" 
      sx={{ display: 'flex', flexDirection: 'column', paddingBottom: 10, marginTop: 4 }}
    >
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
          onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de busca
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
                <TableCell style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Arquivo</TableCell>
                <TableCell style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProcessos.map((processo) => (
                <TableRow key={processo.id}>
                  <TableCell>{processo.nome}</TableCell>
                  <TableCell>{processo.numeroProcesso}</TableCell>
                  <TableCell>{processo.setor ? processo.setor.nome : 'Setor Intermediário'}</TableCell>
                  <TableCell>{processo.tipoProcesso ? processo.tipoProcesso.nome : ''}</TableCell>
                  <TableCell>{processo.descricao}</TableCell>
                  <TableCell>{processo.status ? 'status aqui' : 'Em Andamento'}</TableCell>
                  <TableCell>
                    {processo.arquivo ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload(processo.id)}
                      >
                        Download
                      </Button>
                    ) : (
                      'Sem arquivo'
                    )}
                  </TableCell>
                  <TableCell>
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
              {filteredProcessos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Nenhum processo encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default ListaProcessos;
