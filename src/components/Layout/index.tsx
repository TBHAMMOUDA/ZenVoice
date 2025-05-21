import React, {useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Avatar,
  Badge,
  SwipeableDrawer,
  ListItemButton,
  ListItemSecondaryAction,
  Button,
  Divider,
  Collapse
} from '@mui/material';
import { LayoutDashboard, FileText, ShoppingCart, Users, 
  LogOut, Sun, Moon, Settings, Bell, X, Building,
  ChevronDown, ChevronRight, SquareUserRound, BookUser
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Layout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  
  const handleToggle = (key: string) => {
    setOpenMap(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      text: 'New invoice received from Tech Solutions Inc.',
      timestamp: '2025-05-18T07:30:00Z',
      read: false,
      url: '/invoices/INV-2024-001'
    },
    {
      id: '2',
      text: 'Order ORD-2024-002 status changed to processing',
      timestamp: '2025-05-17T14:45:00Z',
      read: false,
      url: '/orders/ORD-2024-002'
    },
    {
      id: '3',
      text: 'Monthly report is now available for download',
      timestamp: '2025-05-16T09:15:00Z',
      read: true,
      url: null
    }
  ]);

  const menuItems = [
    { text: t('navigation.dashboard'), icon: <LayoutDashboard size={24} />, path: '/' },
    { text: t('navigation.invoices'), icon: <FileText size={24} />, path: '/invoices' },
    { text: t('navigation.orders'), icon: <ShoppingCart size={24} />, path: '/orders' },
    { 
      text: t('navigation.contacts'), 
      icon: <Users size={24} />, 
      children: [
        { text: t('navigation.contacts'), icon:<Users size={24} />, path: '/contacts' },
        { text: t('navigation.customListContacts'), icon: <BookUser size={24} />, path: '/custom-lists' }
      ] 
    },
    { text: t('navigation.companies'), icon: <Building size={24} />, path: '/companies' },
  ];

  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('app.name')}
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <IconButton 
              color="inherit" 
              onClick={() => setNotificationDrawerOpen(true)}
            >
              <Badge 
                badgeContent={notifications.filter(n => !n.read).length} 
                color="error"
                sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', height: '16px', minWidth: '16px' } }}
              >
                <Bell size={20} />
              </Badge>
            </IconButton>
            <IconButton 
              color="inherit" 
              onClick={() => navigate('/settings')}
              sx={{ ml: 1 }}
            >
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
              <React.Fragment key={item.text}>
                <ListItemButton
                  onClick={() => {
                    if (item.children) {
                      handleToggle(item.text);
                    } else if (item.path) {
                      navigate(item.path);
                    }
                  }}
                  selected={!item.children && location.pathname === item.path}
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
                  <ListItemIcon sx={{ 
                    color: !item.children && location.pathname === item.path ? 'white' : 'inherit' 
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                  {item.children && (
                    openMap[item.text] ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                  )}
                </ListItemButton>
                
                {item.children && (
                  <Collapse in={openMap[item.text]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <ListItemButton
                          key={child.text}
                          onClick={() => navigate(child.path)}
                          selected={location.pathname === child.path}
                          sx={{
                            pl: 4,
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
                          <ListItemIcon sx={{ 
                            color: location.pathname === child.path ? 'white' : 'inherit' 
                          }}>
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText primary={child.text} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
      {/* Notification Drawer */}
      <SwipeableDrawer
        anchor="right"
        open={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        onOpen={() => setNotificationDrawerOpen(true)}
        sx={{
          '& .MuiDrawer-paper': { 
            width: { xs: '100%', sm: 400 },
            boxSizing: 'border-box',
            p: 2
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {t('notifications.title')}
          </Typography>
          <IconButton onClick={() => setNotificationDrawerOpen(false)}>
            <X size={20} />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {notifications.length > 0 ? (
          <List>
            {notifications.map((notification) => (
              <ListItem 
                key={notification.id} 
                disablePadding
                sx={{ 
                  mb: 1, 
                  bgcolor: notification.read ? 'transparent' : 'action.hover',
                  borderRadius: 1
                }}
              >
                <ListItemButton
                  onClick={() => {
                    if (notification.url) {
                      navigate(notification.url);
                      setNotificationDrawerOpen(false);
                      
                      // Mark as read
                      setNotifications(prev => 
                        prev.map(n => 
                          n.id === notification.id ? { ...n, read: true } : n
                        )
                      );
                    }
                  }}
                  sx={{ 
                    borderRadius: 1,
                    cursor: notification.url ? 'pointer' : 'default'
                  }}
                >
                  <ListItemText
                    primary={notification.text}
                    secondary={new Date(notification.timestamp).toLocaleString()}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: notification.read ? 'normal' : 'medium'
                    }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotifications(prev => 
                          prev.filter(n => n.id !== notification.id)
                        );
                      }}
                    >
                      <X size={16} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Typography color="text.secondary">{t('notifications.noNotifications')}</Typography>
          </Box>
        )}
        
        {notifications.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => {
                setNotifications(prev => 
                  prev.map(n => ({ ...n, read: true }))
                );
              }}
            >
              {t('notifications.markAllRead')}
            </Button>
          </Box>
        )}
      </SwipeableDrawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
