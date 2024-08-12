import React from 'react';
import CadastroProcesso from './components/CadastroProcesso';
import ListaProcessos from './components/ListaProcessos';
import { Container, Button, Typography } from '@mui/material';

function App() {
  const [view, setView] = React.useState('list');

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Gestão de Processos
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setView('list')}
        style={{ marginRight: 8 }}
      >
        Ver Lista de Processos
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setView('add')}
      >
        Cadastrar Novo Processo
      </Button>

      {view === 'list' ? <ListaProcessos /> : <CadastroProcesso />}
    </Container>
  );
}

export default App;

