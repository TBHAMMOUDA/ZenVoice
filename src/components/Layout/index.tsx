import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material';
import { LayoutDashboard, FileText, ShoppingCart, Users, LogOut, Sun, Moon, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { mode, toggleTheme } = useTheme();

  const menuItems = [
    { text: 'Dashboard', icon: <LayoutDashboard size={24} />, path: '/' },
    { text: 'Invoices', icon: <FileText size={24} />, path: '/invoices' },
    { text: 'Orders', icon: <ShoppingCart size={24} />, path: '/orders' },
    { text: 'Contacts', icon: <Users size={24} />, path: '/contacts' },
  ];

  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            InvoicePro
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <IconButton color="inherit" onClick={() => navigate('/settings')}>
              <Settings size={20} />
            </IconButton>
            <IconButton 
              sx={{ ml: 1 }}
              onClick={() => navigate('/profile')}
            >
              <Avatar src={user?.avatar} alt={user?.name} sx={{ width: 32, height: 32 }} />
            </IconButton>
            <Typography variant="subtitle1" sx={{ ml: 1, mr: 2 }}>
              {user?.name}
            </Typography>
            <IconButton color="inherit" onClick={logout}>
              <LogOut size={20} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? 'white' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout
