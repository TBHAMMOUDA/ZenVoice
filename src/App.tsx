import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';

import Layout from './components/Layout';
import NotFound from './pages/NotFound.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';

import Invoices from './pages/Invoices.tsx';
import InvoiceDetails from './pages/InvoiceDetails.tsx';
import CreateInvoice from './pages/CreateInvoice.tsx';
import Orders from './pages/Orders.tsx';
import OrderDetails from './pages/OrderDetails.tsx';
import Contacts from './pages/Contacts.tsx';
import CustomLists from './pages/CustomLists';
import CustomListDetail from './pages/CustomListDetail';
import CustomListForm from './pages/CustomListForm';
import Profile from './pages/Profile.tsx';
import Settings from './pages/settings/Settings.tsx';
import Companies from './pages/companies/Companies.tsx';

function App() {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to login if not authenticated and not already on login page
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      <CssBaseline />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />

            <Route path="invoices" element={<Invoices />} />
            <Route path="invoices/:id" element={<InvoiceDetails />} />     
            <Route path="invoices/create" element={<CreateInvoice />} />

            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetails />} />

            <Route path="custom-lists" element={<CustomLists />} />
            <Route path="custom-lists/:id" element={<CustomListDetail />} />
            <Route path="custom-lists/create" element={<CustomListForm />} />
            <Route path="custom-lists/:id/edit" element={<CustomListForm />} />

            <Route path="companies" element={<Companies />} />
            <Route path="contacts" element={<Contacts />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Box>
  );
}

export default App;
