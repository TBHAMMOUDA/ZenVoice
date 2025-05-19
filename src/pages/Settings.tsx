import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Tab,
  Tabs,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Tag, 
  Briefcase,
  Globe,
  Building
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Import modular components
import ContactTags from './settings/ContactTags';
import CompanyServices from './settings/CompanyServices';
import CompanyCategories from './settings/CompanyCategories';
import UserPreferences from './settings/UserPreferences';

const Settings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  
  // Error and success message states
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Tab handling
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSuccessMessage(null);
    setError(null);
  };

  if (!user) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            {t('common.error')}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
            {t('settings.title')}
          </Typography>

          <Paper sx={{ mb: 4 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab 
                icon={<Tag size={16} />} 
                label={t('settings.tabs.tags')} 
                iconPosition="start" 
              />
              <Tab 
                icon={<Building size={16} />} 
                label="Company Categories" 
                iconPosition="start" 
              />
              <Tab 
                icon={<Briefcase size={16} />} 
                label={t('settings.tabs.companyServices')} 
                iconPosition="start" 
              />
              <Tab 
                icon={<Globe size={16} />} 
                label={t('settings.language.title')} 
                iconPosition="start" 
              />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* Tags Section */}
              {tabValue === 0 && (
                <ContactTags 
                  onError={setError}
                  onSuccess={setSuccessMessage}
                />
              )}

              {/* Company Categories Section */}
              {tabValue === 1 && (
                <CompanyCategories 
                  onError={setError}
                  onSuccess={setSuccessMessage}
                />
              )}

              {/* Company Services Section */}
              {tabValue === 2 && (
                <CompanyServices 
                  onError={setError}
                  onSuccess={setSuccessMessage}
                />
              )}

              {/* Language Settings Section */}
              {tabValue === 3 && (
                <UserPreferences 
                  onError={setError}
                  onSuccess={setSuccessMessage}
                />
              )}
            </Box>
          </Paper>
        </Box>
      </Container>
      
      {/* Success and Error Snackbars */}
      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default Settings;
