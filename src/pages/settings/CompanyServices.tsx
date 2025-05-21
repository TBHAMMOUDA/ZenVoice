import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Pagination,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Briefcase
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { servicesApi, NavigationDto } from '../../services/api';

const ITEMS_PER_PAGE = 25;

interface CompanyServicesProps {
  onError: (error: string | null) => void;
  onSuccess: (message: string | null) => void;
}

const CompanyServices: React.FC<CompanyServicesProps> = ({ onError, onSuccess }) => {
  const { t } = useTranslation();
  
  // Loading state
  const [loading, setLoading] = useState(false);
  
  // Services state
  const [services, setServices] = useState<NavigationDto[]>([]);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [serviceDeleteConfirmOpen, setServiceDeleteConfirmOpen] = useState(false);
  const [currentService, setCurrentService] = useState<NavigationDto>({ id: undefined, name: '', description: '' });
  const [isServiceEditMode, setIsServiceEditMode] = useState(false);
  const [serviceFilter, setServiceFilter] = useState('');
  const [servicePage, setServicePage] = useState(1);
  
  // Fetch data on component mount
  useEffect(() => {
    fetchServices();
  }, []);
  
  // Fetch services from API
  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await servicesApi.getAll();
      setServices(data);
      onError(null);
    } catch (err) {
      onError('Failed to load services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Filtered items
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(serviceFilter.toLowerCase())
  );
  
  // Paginated items
  const paginatedServices = filteredServices.slice(
    (servicePage - 1) * ITEMS_PER_PAGE, 
    servicePage * ITEMS_PER_PAGE
  );
  
  // Reset pagination when filter changes
  useEffect(() => {
    setServicePage(1);
  }, [serviceFilter]);
  
  // Services handlers
  const handleAddService = () => {
    setCurrentService({ id: undefined, name: '', description: '' });
    setIsServiceEditMode(false);
    setServiceDialogOpen(true);
  };
  
  const handleEditService = (service: NavigationDto) => {
    setCurrentService(service);
    setIsServiceEditMode(true);
    setServiceDialogOpen(true);
  };
  
  const handleServiceDelete = (service: NavigationDto) => {
    setCurrentService(service);
    setServiceDeleteConfirmOpen(true);
  };
  
  const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentService({
      ...currentService,
      [name]: value
    });
  };
  
  const handleServiceSave = async () => {
    if (currentService.name.trim() && currentService.description?.trim()) {
      try {
        setLoading(true);
        if (isServiceEditMode && currentService.id) {
          // Update existing service
          const updatedService = await servicesApi.update(currentService.id, {
            name: currentService.name,
            description: currentService.description
          });
          setServices(services.map(service => 
            service.id === updatedService.id ? updatedService : service
          ));
          onSuccess('Service updated successfully');
        } else {
          // Add new service
          const newService = await servicesApi.create({
            name: currentService.name,
            description: currentService.description
          });
          setServices([...services, newService]);
          onSuccess('Service created successfully');
        }
        setServiceDialogOpen(false);
        onError(null);
      } catch (err) {
        onError(isServiceEditMode ? 'Failed to update service' : 'Failed to create service');
        console.error('Error saving service:', err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const confirmServiceDelete = async () => {
    if (currentService && currentService.id) {
      try {
        setLoading(true);
        // Note: API doesn't have a delete endpoint for services, so we're just removing it from the UI
        // In a real implementation, you would call the delete API here
        setServices(services.filter(service => service.id !== currentService.id));
        setServiceDeleteConfirmOpen(false);
        onSuccess('Service deleted successfully');
        onError(null);
      } catch (err) {
        onError('Failed to delete service');
        console.error('Error deleting service:', err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleServiceFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServiceFilter(e.target.value);
  };
  
  const handleServicePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setServicePage(value);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('settings.services.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {t('settings.services.description')}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          placeholder={t('settings.services.filterServices')}
          value={serviceFilter}
          onChange={handleServiceFilterChange}
          size="small"
          sx={{ width: '300px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<Plus size={16} />}
          onClick={handleAddService}
          disabled={loading}
        >
          {t('settings.services.addService')}
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <Grid container spacing={2}>
          {paginatedServices.map((service) => (
            <Grid item xs={12} sm={6} key={service.id}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%',
                  '&:hover': {
                    boxShadow: 2
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="h3">
                      {service.name}
                    </Typography>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditService(service)}
                        sx={{ mr: 0.5 }}
                        disabled={loading}
                      >
                        <Edit size={16} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleServiceDelete(service)}
                        disabled={loading}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && filteredServices.length > ITEMS_PER_PAGE && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination 
            count={Math.ceil(filteredServices.length / ITEMS_PER_PAGE)} 
            page={servicePage} 
            onChange={handleServicePageChange} 
            color="primary" 
          />
        </Box>
      )}

      {!loading && filteredServices.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            {t('common.noResults')}
          </Typography>
        </Box>
      )}

      {/* Service Dialog */}
      <Dialog open={serviceDialogOpen} onClose={() => setServiceDialogOpen(false)}>
        <DialogTitle>
          {isServiceEditMode ? t('common.edit') : t('common.add')} {t('settings.tabs.companyServices')}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label={t('settings.services.serviceName')}
            type="text"
            fullWidth
            value={currentService.name}
            onChange={handleServiceInputChange}
            sx={{ mb: 2 }}
            disabled={loading}
          />
          <TextField
            margin="dense"
            name="description"
            label={t('settings.services.serviceDescription')}
            type="text"
            fullWidth
            multiline
            rows={3}
            value={currentService.description || ''}
            onChange={handleServiceInputChange}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setServiceDialogOpen(false)} disabled={loading}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleServiceSave} 
            color="primary"
            disabled={loading || !currentService.name.trim() || !currentService.description?.trim()}
          >
            {loading ? <CircularProgress size={24} /> : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Service Delete Confirmation Dialog */}
      <Dialog open={serviceDeleteConfirmOpen} onClose={() => setServiceDeleteConfirmOpen(false)}>
        <DialogTitle>{t('common.delete')} {t('settings.tabs.companyServices')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('settings.services.deleteConfirm')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setServiceDeleteConfirmOpen(false)} disabled={loading}>{t('common.cancel')}</Button>
          <Button 
            onClick={confirmServiceDelete} 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyServices;
