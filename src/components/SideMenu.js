import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Drawer, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddIcon from '@mui/icons-material/Add';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PersonAddIcon from '@mui/icons-material/PersonAdd'; 
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; 
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

const SideMenu = ({ open, onClose, onLogout }) => {
  const navigate = useNavigate();  // Use useNavigate para navegação

  const userType = localStorage.getItem('userType'); // Pegue o tipo de usuário no localStorage

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        style: { width: 240, backgroundColor: '#008F6D', color: '#ffffff' },
      }}
    >
      <List>
        <ListItem button onClick={() => navigate('/home')} style={{ justifyContent: 'center' }}>
          <ListItemIcon>
            <HomeIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Tela Inicial" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
        </ListItem>
        <Divider style={{ backgroundColor: '#008F6D' }} />

        {!userType && (
          <>
            <ListItem button onClick={() => navigate('/cadastrarUsuario')} style={{ justifyContent: 'center' }}>
              <ListItemIcon>
                <PersonAddIcon style={{ color: '#ffffff' }} />
              </ListItemIcon>
              <ListItemText primary="Cadastrar Usuário" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
            </ListItem>
            <Divider style={{ backgroundColor: '#008F6D' }} />
          </>
        )}

        {userType === 'USUARIO' && (
          <>
            <ListItem button onClick={() => navigate('/list')} style={{ justifyContent: 'center' }}>
              <ListItemIcon>
                <ViewListIcon style={{ color: '#ffffff' }} />
              </ListItemIcon>
              <ListItemText primary="Listar Processos" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
            </ListItem>
            <Divider style={{ backgroundColor: '#008F6D' }} />
            <ListItem button onClick={() => navigate('/add')} style={{ justifyContent: 'center' }}>
              <ListItemIcon>
                <AddIcon style={{ color: '#ffffff' }} />
              </ListItemIcon>
              <ListItemText primary="Cadastrar Processo" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
            </ListItem>
            <Divider style={{ backgroundColor: '#008F6D' }} />
          </>
        )}

        {userType === 'FUNCIONARIO' && (
          <>
            <ListItem button onClick={() => navigate('/list')} style={{ justifyContent: 'center' }}>
              <ListItemIcon>
                <ViewListIcon style={{ color: '#ffffff' }} />
              </ListItemIcon>
              <ListItemText primary="Listar Processos" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
            </ListItem>
            <Divider style={{ backgroundColor: '#008F6D' }} />
            <ListItem button onClick={() => navigate('/movimentar')} style={{ justifyContent: 'center' }}>
              <ListItemIcon>
                <SwapHorizIcon style={{ color: '#ffffff' }} />
              </ListItemIcon>
              <ListItemText primary="Movimentar Processo" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
            </ListItem>
            <Divider style={{ backgroundColor: '#008F6D' }} />
          </>
        )}

        {userType && (
          <>
            <ListItem button onClick={onLogout} style={{ justifyContent: 'center' }}>
              <ListItemIcon>
                <ExitToAppIcon style={{ color: '#ffffff' }} />
              </ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
            </ListItem>
            <Divider style={{ backgroundColor: '#008F6D' }} />
          </>
        )}
      </List>
    </Drawer>
  );
};

export default SideMenu;
