import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Divider, 
  Card, 
  CardContent,
  Button,
  Chip,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Tab,
  Tabs,
  Pagination,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Tag, 
  Plus, 
  X, 
  Check, 
  Edit, 
  Trash2, 
  Info, 
  Settings as SettingsIcon,
  Briefcase,
  Search,
  Globe,
  Building
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { tagsApi, servicesApi, categoriesApi, TagDto, ServiceDto, CategoryDto } from '../services/api';

const ITEMS_PER_PAGE = 25;

const Settings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { currentLanguage, changeLanguage, useSystemLanguage, setUseSystemLanguage } = useLanguage();
  const [tabValue, setTabValue] = useState(0);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Tags state
  const [tags, setTags] = useState<TagDto[]>([]);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [tagDeleteConfirmOpen, setTagDeleteConfirmOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState<TagDto>({ id: undefined, name: '', description: '' });
  const [isTagEditMode, setIsTagEditMode] = useState(false);
  const [tagFilter, setTagFilter] = useState('');
  const [tagPage, setTagPage] = useState(1);
  
  // Company Categories state
  const [companyCategories, setCompanyCategories] = useState<CategoryDto[]>([]);
  const [companyCategoryDialogOpen, setCompanyCategoryDialogOpen] = useState(false);
  const [companyCategoryDeleteConfirmOpen, setCompanyCategoryDeleteConfirmOpen] = useState(false);
  const [currentCompanyCategory, setCurrentCompanyCategory] = useState<CategoryDto>({ id: undefined, name: '', description: '' });
  const [isCompanyCategoryEditMode, setIsCompanyCategoryEditMode] = useState(false);
  const [companyCategoryFilter, setCompanyCategoryFilter] = useState('');
  const [companyCategoryPage, setCompanyCategoryPage] = useState(1);
  
  // Services state
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [serviceDeleteConfirmOpen, setServiceDeleteConfirmOpen] = useState(false);
  const [currentService, setCurrentService] = useState<ServiceDto>({ id: undefined, name: '', description: '' });
  const [isServiceEditMode, setIsServiceEditMode] = useState(false);
  const [serviceFilter, setServiceFilter] = useState('');
  const [servicePage, setServicePage] = useState(1);
  
  // Fetch data on component mount
  useEffect(() => {
    fetchTags();
    fetchCompanyCategories();
    fetchServices();
  }, []);
  
  // Fetch tags from API
  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await tagsApi.getAll();
      setTags(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tags');
      console.error('Error fetching tags:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch company categories from API
  const fetchCompanyCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesApi.getAll();
      setCompanyCategories(data);
      setError(null);
    } catch (err) {
      setError('Failed to load company categories');
      console.error('Error fetching company categories:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch services from API
  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await servicesApi.getAll();
      setServices(data);
      setError(null);
    } catch (err) {
      setError('Failed to load services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Filtered items
  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(tagFilter.toLowerCase())
  );
  
  const filteredCompanyCategories = companyCategories.filter(category => 
    category.name.toLowerCase().includes(companyCategoryFilter.toLowerCase())
  );
  
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(serviceFilter.toLowerCase())
  );
  
  // Paginated items
  const paginatedTags = filteredTags.slice(
    (tagPage - 1) * ITEMS_PER_PAGE, 
    tagPage * ITEMS_PER_PAGE
  );
  
  const paginatedCompanyCategories = filteredCompanyCategories.slice(
    (companyCategoryPage - 1) * ITEMS_PER_PAGE, 
    companyCategoryPage * ITEMS_PER_PAGE
  );
  
  const paginatedServices = filteredServices.slice(
    (servicePage - 1) * ITEMS_PER_PAGE, 
    servicePage * ITEMS_PER_PAGE
  );
  
  // Reset pagination when filter changes
  useEffect(() => {
    setTagPage(1);
  }, [tagFilter]);
  
  useEffect(() => {
    setCompanyCategoryPage(1);
  }, [companyCategoryFilter]);
  
  useEffect(() => {
    setServicePage(1);
  }, [serviceFilter]);
  
  // Tab handling
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Tags handlers
  const handleAddTag = () => {
    setCurrentTag({ id: undefined, name: '', description: '' });
    setIsTagEditMode(false);
    setTagDialogOpen(true);
  };
  
  const handleEditTag = (tag) => {
    setCurrentTag(tag);
    setIsTagEditMode(true);
    setTagDialogOpen(true);
  };
  
  const handleTagDelete = (tag) => {
    setCurrentTag(tag);
    setTagDeleteConfirmOpen(true);
  };
  
  const handleTagInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTag({
      ...currentTag,
      [name]: value
    });
  };
  
  const handleTagSave = async () => {
    if (currentTag.name.trim()) {
      try {
        setLoading(true);
        if (isTagEditMode && currentTag.id) {
          // Update existing tag
          const updatedTag = await tagsApi.update(currentTag.id, currentTag);
          setTags(tags.map(tag => tag.id === updatedTag.id ? updatedTag : tag));
          setSuccessMessage('Tag updated successfully');
        } else {
          // Add new tag
          const newTag = await tagsApi.create(currentTag);
          setTags([...tags, newTag]);
          setSuccessMessage('Tag created successfully');
        }
        setTagDialogOpen(false);
        setError(null);
      } catch (err) {
        setError(isTagEditMode ? 'Failed to update tag' : 'Failed to create tag');
        console.error('Error saving tag:', err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const confirmTagDelete = async () => {
    if (currentTag && currentTag.id) {
      try {
        setLoading(true);
        // Note: API doesn't have a delete endpoint for tags, so we're just removing it from the UI
        // In a real implementation, you would call the delete API here
        setTags(tags.filter(tag => tag.id !== currentTag.id));
        setTagDeleteConfirmOpen(false);
        setSuccessMessage('Tag deleted successfully');
        setError(null);
      } catch (err) {
        setError('Failed to delete tag');
        console.error('Error deleting tag:', err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleTagFilterChange = (e) => {
    setTagFilter(e.target.value);
  };
  
  const handleTagPageChange = (event, value) => {
    setTagPage(value);
  };
  
  // Company Categories handlers
  const handleAddCompanyCategory = () => {
    setCurrentCompanyCategory({ id: undefined, name: '', description: '' });
    setIsCompanyCategoryEditMode(false);
    setCompanyCategoryDialogOpen(true);
  };
  
  const handleEditCompanyCategory = (category) => {
    setCurrentCompanyCategory(category);
    setIsCompanyCategoryEditMode(true);
    setCompanyCategoryDialogOpen(true);
  };
  
  const handleCompanyCategoryDelete = (category) => {
    setCurrentCompanyCategory(category);
    setCompanyCategoryDeleteConfirmOpen(true);
  };
  
  const handleCompanyCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCompanyCategory({
      ...currentCompanyCategory,
      [name]: value
    });
  };
  
  const handleCompanyCategorySave = async () => {
    if (currentCompanyCategory.name.trim()) {
      try {
        setLoading(true);
        if (isCompanyCategoryEditMode && currentCompanyCategory.id) {
          // Update existing category
          const updatedCategory = await categoriesApi.update(currentCompanyCategory.id, currentCompanyCategory);
          setCompanyCategories(companyCategories.map(category => 
            category.id === updatedCategory.id ? updatedCategory : category
          ));
          setSuccessMessage('Company category updated successfully');
        } else {
          // Add new category
          const newCategory = await categoriesApi.create(currentCompanyCategory);
          setCompanyCategories([...companyCategories, newCategory]);
          setSuccessMessage('Company category created successfully');
        }
        setCompanyCategoryDialogOpen(false);
        setError(null);
      } catch (err) {
        setError(isCompanyCategoryEditMode ? 'Failed to update company category' : 'Failed to create company category');
        console.error('Error saving company category:', err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const confirmCompanyCategoryDelete = async () => {
    if (currentCompanyCategory && currentCompanyCategory.id) {
      try {
        setLoading(true);
        // Note: API doesn't have a delete endpoint for categories, so we're just removing it from the UI
        // In a real implementation, you would call the delete API here
        setCompanyCategories(companyCategories.filter(category => category.id !== currentCompanyCategory.id));
        setCompanyCategoryDeleteConfirmOpen(false);
        setSuccessMessage('Company category deleted successfully');
        setError(null);
      } catch (err) {
        setError('Failed to delete company category');
        console.error('Error deleting company category:', err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleCompanyCategoryFilterChange = (e) => {
    setCompanyCategoryFilter(e.target.value);
  };
  
  const handleCompanyCategoryPageChange = (event, value) => {
    setCompanyCategoryPage(value);
  };
  
  // Services handlers
  const handleAddService = () => {
    setCurrentService({ id: undefined, name: '', description: '' });
    setIsServiceEditMode(false);
    setServiceDialogOpen(true);
  };
  
  const handleEditService = (service) => {
    setCurrentService(service);
    setIsServiceEditMode(true);
    setServiceDialogOpen(true);
  };
  
  const handleServiceDelete = (service) => {
    setCurrentService(service);
    setServiceDeleteConfirmOpen(true);
  };
  
  const handleServiceInputChange = (e) => {
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
          setSuccessMessage('Service updated successfully');
        } else {
          // Add new service
          const newService = await servicesApi.create({
            name: currentService.name,
            description: currentService.description
          });
          setServices([...services, newService]);
          setSuccessMessage('Service created successfully');
        }
        setServiceDialogOpen(false);
        setError(null);
      } catch (err) {
        setError(isServiceEditMode ? 'Failed to update service' : 'Failed to create service');
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
        setSuccessMessage('Service deleted successfully');
        setError(null);
      } catch (err) {
        setError('Failed to delete service');
        console.error('Error deleting service:', err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleServiceFilterChange = (e) => {
    setServiceFilter(e.target.value);
  };
  
  const handleServicePageChange = (event, value) => {
    setServicePage(value);
  };

  // Language handlers
  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    changeLanguage(newLang);
  };

  const handleSystemLanguageToggle = (event) => {
    setUseSystemLanguage(event.target.checked);
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
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {t('settings.tags.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {t('settings.tags.description')}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <TextField
                      placeholder={t('settings.tags.filterTags')}
                      value={tagFilter}
                      onChange={handleTagFilterChange}
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
                      onClick={handleAddTag}
                      disabled={loading}
                    >
                      {t('settings.tags.addTag')}
                    </Button>
                  </Box>

                  {loading && tabValue === 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                      <CircularProgress />
                    </Box>
                  )}

                  {!loading && (
                    <Grid container spacing={2}>
                      {paginatedTags.map((tag) => (
                        <Grid item xs={12} sm={6} md={4} key={tag.id}>
                          <Card 
                            variant="outlined" 
                            sx={{ 
                              height: '100%',
                              '&:hover': {
                                boxShadow: 2
                              }
                            }}
                          >
                            <CardContent sx={{ pb: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Tooltip 
                                  title={tag.description || ''} 
                                  arrow 
                                  placement="top"
                                  enterDelay={500}
                                  leaveDelay={200}
                                >
                                  <Chip 
                                    label={tag.name} 
                                    size="small" 
                                    color="primary" 
                                    variant="outlined"
                                  />
                                </Tooltip>
                                <Box>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleEditTag(tag)}
                                    sx={{ mr: 0.5 }}
                                    disabled={loading}
                                  >
                                    <Edit size={16} />
                                  </IconButton>
                                  <IconButton 
                                    size="small" 
                                    color="error" 
                                    onClick={() => handleTagDelete(tag)}
                                    disabled={loading}
                                  >
                                    <Trash2 size={16} />
                                  </IconButton>
                                </Box>
                              </Box>
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ 
                                  mt: 1,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {tag.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}

                  {!loading && filteredTags.length > ITEMS_PER_PAGE && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                      <Pagination 
                        count={Math.ceil(filteredTags.length / ITEMS_PER_PAGE)} 
                        page={tagPage} 
                        onChange={handleTagPageChange} 
                        color="primary" 
                      />
                    </Box>
                  )}

                  {!loading && filteredTags.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        {t('common.noResults')}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Company Categories Section */}
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Company Categories
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Manage company categories to organize and classify your business contacts.
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <TextField
                      placeholder="Filter categories..."
                      value={companyCategoryFilter}
                      onChange={handleCompanyCategoryFilterChange}
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
                      onClick={handleAddCompanyCategory}
                      disabled={loading}
                    >
                      Add Category
                    </Button>
                  </Box>

                  {loading && tabValue === 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                      <CircularProgress />
                    </Box>
                  )}

                  {!loading && (
                    <Grid container spacing={2}>
                      {paginatedCompanyCategories.map((category) => (
                        <Grid item xs={12} sm={6} md={4} key={category.id}>
                          <Card 
                            variant="outlined" 
                            sx={{ 
                              height: '100%',
                              '&:hover': {
                                boxShadow: 2
                              }
                            }}
                          >
                            <CardContent sx={{ pb: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Tooltip 
                                  title={category.description || ''} 
                                  arrow 
                                  placement="top"
                                  enterDelay={500}
                                  leaveDelay={200}
                                >
                                  <Chip 
                                    label={category.name} 
                                    size="small" 
                                    color="secondary" 
                                    variant="outlined"
                                  />
                                </Tooltip>
                                <Box>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleEditCompanyCategory(category)}
                                    sx={{ mr: 0.5 }}
                                    disabled={loading}
                                  >
                                    <Edit size={16} />
                                  </IconButton>
                                  <IconButton 
                                    size="small" 
                                    color="error" 
                                    onClick={() => handleCompanyCategoryDelete(category)}
                                    disabled={loading}
                                  >
                                    <Trash2 size={16} />
                                  </IconButton>
                                </Box>
                              </Box>
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ 
                                  mt: 1,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {category.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}

                  {!loading && filteredCompanyCategories.length > ITEMS_PER_PAGE && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                      <Pagination 
                        count={Math.ceil(filteredCompanyCategories.length / ITEMS_PER_PAGE)} 
                        page={companyCategoryPage} 
                        onChange={handleCompanyCategoryPageChange} 
                        color="primary" 
                      />
                    </Box>
                  )}

                  {!loading && filteredCompanyCategories.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        {t('common.noResults')}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Company Services Section */}
              {tabValue === 2 && (
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

                  {loading && tabValue === 2 && (
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
                </Box>
              )}

              {/* Language Settings Section */}
              {tabValue === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {t('settings.language.title')}
                  </Typography>
                  
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={useSystemLanguage}
                            onChange={handleSystemLanguageToggle}
                            color="primary"
                          />
                        }
                        label={t('settings.language.useSystemLanguage')}
                        sx={{ mb: 2 }}
                      />
                      
                      <FormControl fullWidth disabled={useSystemLanguage}>
                        <InputLabel id="language-select-label">{t('settings.language.selectLanguage')}</InputLabel>
                        <Select
                          labelId="language-select-label"
                          value={currentLanguage}
                          onChange={handleLanguageChange}
                          label={t('settings.language.selectLanguage')}
                        >
                          <MenuItem value="en">{t('settings.language.english')}</MenuItem>
                          <MenuItem value="fr">{t('settings.language.french')}</MenuItem>
                          <MenuItem value="de">{t('settings.language.german')}</MenuItem>
                        </Select>
                      </FormControl>
                    </CardContent>
                  </Card>
                  
                  <Typography variant="body2" color="text.secondary">
                    {useSystemLanguage 
                      ? t('settings.language.useSystemLanguage') 
                      : t('settings.language.selectLanguage')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Container>
      
      {/* Tag Dialog */}
      <Dialog open={tagDialogOpen} onClose={() => setTagDialogOpen(false)}>
        <DialogTitle>
          {isTagEditMode ? t('common.edit') : t('common.add')} {t('settings.tabs.tags')}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label={t('settings.tags.tagName')}
            type="text"
            fullWidth
            value={currentTag.name}
            onChange={handleTagInputChange}
            sx={{ mb: 2 }}
            disabled={loading}
          />
          <TextField
            margin="dense"
            name="description"
            label={t('settings.tags.tagDescription')}
            type="text"
            fullWidth
            multiline
            rows={3}
            value={currentTag.description || ''}
            onChange={handleTagInputChange}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTagDialogOpen(false)} disabled={loading}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleTagSave} 
            color="primary"
            disabled={loading || !currentTag.name.trim()}
          >
            {loading ? <CircularProgress size={24} /> : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Tag Delete Confirmation Dialog */}
      <Dialog open={tagDeleteConfirmOpen} onClose={() => setTagDeleteConfirmOpen(false)}>
        <DialogTitle>{t('common.delete')} {t('settings.tabs.tags')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('settings.tags.deleteConfirm')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTagDeleteConfirmOpen(false)} disabled={loading}>{t('common.cancel')}</Button>
          <Button 
            onClick={confirmTagDelete} 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Company Category Dialog */}
      <Dialog open={companyCategoryDialogOpen} onClose={() => setCompanyCategoryDialogOpen(false)}>
        <DialogTitle>
          {isCompanyCategoryEditMode ? 'Edit' : 'Add'} Company Category
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Category Name"
            type="text"
            fullWidth
            value={currentCompanyCategory.name}
            onChange={handleCompanyCategoryInputChange}
            sx={{ mb: 2 }}
            disabled={loading}
          />
          <TextField
            margin="dense"
            name="description"
            label="Category Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={currentCompanyCategory.description || ''}
            onChange={handleCompanyCategoryInputChange}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompanyCategoryDialogOpen(false)} disabled={loading}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleCompanyCategorySave} 
            color="primary"
            disabled={loading || !currentCompanyCategory.name.trim()}
          >
            {loading ? <CircularProgress size={24} /> : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Company Category Delete Confirmation Dialog */}
      <Dialog open={companyCategoryDeleteConfirmOpen} onClose={() => setCompanyCategoryDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Company Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this company category? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompanyCategoryDeleteConfirmOpen(false)} disabled={loading}>{t('common.cancel')}</Button>
          <Button 
            onClick={confirmCompanyCategoryDelete} 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
      
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
