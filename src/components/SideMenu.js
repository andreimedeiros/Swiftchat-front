import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Drawer, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import BusinessIcon from '@mui/icons-material/Business';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const SideMenu = ({ open, onClose, onMenuClick }) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        style: { width: 240, backgroundColor: '#008F6D', color: '#ffffff' }, // Cor de fundo e do texto
      }}
    >
      <List>
        <ListItem button onClick={() => onMenuClick('home')} style={{ justifyContent: 'center' }}>
          <ListItemIcon>
            <HomeIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Tela Inicial" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
        </ListItem>
        <Divider style={{ backgroundColor: '#008F6D' }} />
        <ListItem button onClick={() => onMenuClick('list')} style={{ justifyContent: 'center' }}>
          <ListItemIcon>
            <ViewListIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Ver Processos" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
        </ListItem>
        <Divider style={{ backgroundColor: '#008F6D' }} />
        <ListItem button onClick={() => onMenuClick('add')} style={{ justifyContent: 'center' }}>
          <ListItemIcon>
            <AddIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Cadastrar Processo" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
        </ListItem>
        <Divider style={{ backgroundColor: '#008F6D' }} />
        <ListItem button onClick={() => onMenuClick('tiposProcessos')} style={{ justifyContent: 'center' }}>
          <ListItemIcon>
            <CategoryIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Tipos de Processos" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
        </ListItem>
        <Divider style={{ backgroundColor: '#008F6D' }} />
        <ListItem button onClick={() => onMenuClick('setores')} style={{ justifyContent: 'center' }}>
          <ListItemIcon>
            <BusinessIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Setores" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
        </ListItem>
        <Divider style={{ backgroundColor: '#008F6D' }} />
        <ListItem button onClick={() => onMenuClick('movimentar')} style={{ justifyContent: 'center' }}>
          <ListItemIcon>
            <SwapHorizIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Movimentar Processo" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default SideMenu;
