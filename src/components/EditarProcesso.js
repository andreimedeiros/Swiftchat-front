
import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import api from '../services/api';

const EditarProcesso = ({ open, onClose, processoId, refreshList }) => {
  const [processo, setProcesso] = useState({});

  useEffect(() => {
    if (processoId) {
      const fetchProcesso = async () => {
        try {
          const response = await api.get(`/processos/${processoId}`);
          setProcesso(response.data);
        } catch (error) {
          console.error('Erro ao buscar processo:', error);
        }
      };
      fetchProcesso();
    }
  }, [processoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProcesso(prevProcesso => ({ ...prevProcesso, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await api.put(`/processos/${processoId}`, processo);
      onClose();
      refreshList();
    } catch (error) {
      console.error('Erro ao atualizar processo:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Processo</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="nome"
          label="Nome"
          fullWidth
          variant="standard"
          value={processo.nome || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="cpf"
          label="CPF"
          fullWidth
          variant="standard"
          value={processo.cpf || ''}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="descricao"
          label="Descrição"
          fullWidth
          variant="standard"
          value={processo.descricao || ''}
          onChange={handleChange}
        />
        {/* Adicione outros campos conforme necessário */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarProcesso;
