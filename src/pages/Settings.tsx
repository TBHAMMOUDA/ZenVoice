import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  InputAdornment
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
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Mock data for tags and services
const initialTags = [
  { id: '1', name: 'enterprise', description: 'For large enterprise clients and projects' },
  { id: '2', name: 'tech', description: 'Technology-related projects and clients' },
  { id: '3', name: 'startup', description: 'For startup companies and early-stage businesses' },
  { id: '4', name: 'mobile', description: 'Mobile application development projects' },
  { id: '5', name: 'ai', description: 'Artificial intelligence and machine learning projects' },
  { id: '6', name: 'consulting', description: 'Consulting services and advisory projects' },
  { id: '7', name: 'design', description: 'Design-focused projects and clients' },
  { id: '8', name: 'creative', description: 'Creative and artistic projects' },
  { id: '9', name: 'security', description: 'Security and compliance related projects' },
  { id: '10', name: 'cloud', description: 'Cloud infrastructure and services' },
  { id: '11', name: 'ecommerce', description: 'Online retail and e-commerce projects' },
  { id: '12', name: 'healthcare', description: 'Healthcare and medical industry projects' },
  { id: '13', name: 'finance', description: 'Financial services and banking projects' },
  { id: '14', name: 'education', description: 'Educational institutions and learning platforms' },
  { id: '15', name: 'government', description: 'Government and public sector projects' },
  { id: '16', name: 'nonprofit', description: 'Non-profit organizations and charities' },
  { id: '17', name: 'manufacturing', description: 'Manufacturing and industrial projects' },
  { id: '18', name: 'retail', description: 'Retail and consumer goods clients' },
  { id: '19', name: 'media', description: 'Media and entertainment industry projects' },
  { id: '20', name: 'transportation', description: 'Transportation and logistics projects' },
  { id: '21', name: 'energy', description: 'Energy sector and utilities projects' },
  { id: '22', name: 'real-estate', description: 'Real estate and property management' },
  { id: '23', name: 'legal', description: 'Legal services and law firms' },
  { id: '24', name: 'hospitality', description: 'Hotels, restaurants, and tourism' },
  { id: '25', name: 'agriculture', description: 'Agricultural and farming projects' },
  { id: '26', name: 'construction', description: 'Construction and building projects' },
  { id: '27', name: 'telecom', description: 'Telecommunications industry projects' },
  { id: '28', name: 'automotive', description: 'Automotive industry and vehicle projects' },
  { id: '29', name: 'insurance', description: 'Insurance industry projects' },
  { id: '30', name: 'sports', description: 'Sports and recreation industry projects' }
];

const initialServices = [
  { 
    id: '1', 
    name: 'Web Development', 
    description: 'Full-stack web application development using modern frameworks and technologies.' 
  },
  { 
    id: '2', 
    name: 'Mobile App Development', 
    description: 'Native and cross-platform mobile application development for iOS and Android.' 
  },
  { 
    id: '3', 
    name: 'UI/UX Design', 
    description: 'User interface and experience design focused on usability and conversion optimization.' 
  },
  { 
    id: '4', 
    name: 'Cloud Consulting', 
    description: 'Strategic consulting for cloud migration, architecture, and optimization.' 
  },
  { 
    id: '5', 
    name: 'DevOps Implementation', 
    description: 'Setting up CI/CD pipelines and DevOps practices for efficient software delivery.' 
  },
  { 
    id: '6', 
    name: 'Data Analytics', 
    description: 'Data processing, analysis, and visualization for business intelligence.' 
  },
  { 
    id: '7', 
    name: 'AI Solutions', 
    description: 'Machine learning and artificial intelligence solutions for business problems.' 
  },
  { 
    id: '8', 
    name: 'Cybersecurity Services', 
    description: 'Security assessments, penetration testing, and security implementation.' 
  },
  { 
    id: '9', 
    name: 'E-commerce Development', 
    description: 'Online store development with payment processing and inventory management.' 
  },
  { 
    id: '10', 
    name: 'CRM Implementation', 
    description: 'Customer relationship management system setup and customization.' 
  },
  { 
    id: '11', 
    name: 'ERP Solutions', 
    description: 'Enterprise resource planning system implementation and integration.' 
  },
  { 
    id: '12', 
    name: 'Digital Marketing', 
    description: 'SEO, content marketing, and digital advertising campaigns.' 
  },
  { 
    id: '13', 
    name: 'IT Infrastructure', 
    description: 'Network setup, server management, and IT infrastructure consulting.' 
  },
  { 
    id: '14', 
    name: 'Blockchain Development', 
    description: 'Blockchain applications and smart contract development.' 
  },
  { 
    id: '15', 
    name: 'Quality Assurance', 
    description: 'Software testing, QA automation, and quality management.' 
  },
  { 
    id: '16', 
    name: 'Technical Support', 
    description: 'Ongoing technical support and maintenance for software systems.' 
  },
  { 
    id: '17', 
    name: 'Content Management', 
    description: 'CMS implementation and content strategy development.' 
  },
  { 
    id: '18', 
    name: 'API Development', 
    description: 'Custom API development and third-party integrations.' 
  },
  { 
    id: '19', 
    name: 'Database Design', 
    description: 'Database architecture, optimization, and management.' 
  },
  { 
    id: '20', 
    name: 'IoT Solutions', 
    description: 'Internet of Things device integration and application development.' 
  },
  { 
    id: '21', 
    name: 'AR/VR Development', 
    description: 'Augmented and virtual reality application development.' 
  },
  { 
    id: '22', 
    name: 'Business Analysis', 
    description: 'Requirements gathering, process analysis, and documentation.' 
  },
  { 
    id: '23', 
    name: 'Project Management', 
    description: 'Professional project management services for technology initiatives.' 
  },
  { 
    id: '24', 
    name: 'Legacy System Migration', 
    description: 'Modernization and migration of legacy systems to new platforms.' 
  },
  { 
    id: '25', 
    name: 'Custom Software Development', 
    description: 'Bespoke software solutions tailored to specific business needs.' 
  },
  { 
    id: '26', 
    name: 'SaaS Development', 
    description: 'Software-as-a-Service platform development and deployment.' 
  },
  { 
    id: '27', 
    name: 'Performance Optimization', 
    description: 'Application performance tuning and optimization services.' 
  },
  { 
    id: '28', 
    name: 'Chatbot Development', 
    description: 'AI-powered chatbot and conversational interface development.' 
  },
  { 
    id: '29', 
    name: 'Voice Application Development', 
    description: 'Voice-enabled applications for smart speakers and assistants.' 
  },
  { 
    id: '30', 
    name: 'Accessibility Compliance', 
    description: 'Making digital products accessible to users with disabilities.' 
  }
];

const ITEMS_PER_PAGE = 25;

const Settings = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  
  // Tags state
  const [tags, setTags] = useState(initialTags);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [tagDeleteConfirmOpen, setTagDeleteConfirmOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState({ id: '', name: '', description: '' });
  const [isTagEditMode, setIsTagEditMode] = useState(false);
  const [tagFilter, setTagFilter] = useState('');
  const [tagPage, setTagPage] = useState(1);
  
  // Services state
  const [services, setServices] = useState(initialServices);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [serviceDeleteConfirmOpen, setServiceDeleteConfirmOpen] = useState(false);
  const [currentService, setCurrentService] = useState({ id: '', name: '', description: '' });
  const [isServiceEditMode, setIsServiceEditMode] = useState(false);
  const [serviceFilter, setServiceFilter] = useState('');
  const [servicePage, setServicePage] = useState(1);
  
  // Filtered items
  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(tagFilter.toLowerCase())
  );
  
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(serviceFilter.toLowerCase())
  );
  
  // Paginated items
  const paginatedTags = filteredTags.slice(
    (tagPage - 1) * ITEMS_PER_PAGE, 
    tagPage * ITEMS_PER_PAGE
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
    setServicePage(1);
  }, [serviceFilter]);
  
  // Tab handling
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Tags handlers
  const handleAddTag = () => {
    setCurrentTag({ id: '', name: '', description: '' });
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
  
  const handleTagSave = () => {
    if (currentTag.name.trim()) {
      if (isTagEditMode) {
        // Update existing tag
        setTags(tags.map(tag => 
          tag.id === currentTag.id ? currentTag : tag
        ));
      } else {
        // Add new tag
        const newTag = {
          ...currentTag,
          id: Date.now().toString(),
          description: currentTag.description || `Tag for ${currentTag.name} related items`
        };
        setTags([...tags, newTag]);
      }
      setTagDialogOpen(false);
    }
  };
  
  const confirmTagDelete = () => {
    if (currentTag) {
      setTags(tags.filter(tag => tag.id !== currentTag.id));
      setTagDeleteConfirmOpen(false);
    }
  };
  
  const handleTagFilterChange = (e) => {
    setTagFilter(e.target.value);
  };
  
  const handleTagPageChange = (event, value) => {
    setTagPage(value);
  };
  
  // Services handlers
  const handleAddService = () => {
    setCurrentService({ id: '', name: '', description: '' });
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
  
  const handleServiceSave = () => {
    if (currentService.name.trim() && currentService.description.trim()) {
      if (isServiceEditMode) {
        // Update existing service
        setServices(services.map(service => 
          service.id === currentService.id ? currentService : service
        ));
      } else {
        // Add new service
        const newService = {
          ...currentService,
          id: Date.now().toString()
        };
        setServices([...services, newService]);
      }
      setServiceDialogOpen(false);
    }
  };
  
  const confirmServiceDelete = () => {
    if (currentService) {
      setServices(services.filter(service => service.id !== currentService.id));
      setServiceDeleteConfirmOpen(false);
    }
  };
  
  const handleServiceFilterChange = (e) => {
    setServiceFilter(e.target.value);
  };
  
  const handleServicePageChange = (event, value) => {
    setServicePage(value);
  };

  if (!user) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            User information not available
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
            Settings
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
                label="Tags" 
                iconPosition="start" 
              />
              <Tab 
                icon={<Briefcase size={16} />} 
                label="Company Services" 
                iconPosition="start" 
              />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* Tags Section */}
              {tabValue === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Manage Tags
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Tags help you categorize and filter contacts, invoices, and other items in the system.
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <TextField
                      placeholder="Filter tags..."
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
                    >
                      Add New Tag
                    </Button>
                  </Box>

                  <Grid container spacing={2}>
                    {paginatedTags.map((tag) => (
                      <Grid item xs={12} sm={6} md={4} key={tag.id}>
                        <Card 
                          variant="outlined" 
                          sx={{ 
                            height: '100%',
                            '&:hover': {
                              boxShadow: 2
                            },
                            position: 'relative'
                          }}
                        >
                          <CardContent sx={{ pb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Chip 
                                label={tag.name} 
                                color="primary" 
                                variant="outlined"
                                sx={{ borderRadius: '4px' }}
                              />
                              <Box>
                                <Tooltip title="Edit">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleEditTag(tag)}
                                    sx={{ mr: 0.5 }}
                                  >
                                    <Edit size={16} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleTagDelete(tag)}
                                  >
                                    <Trash2 size={16} />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                            
                            {/* Description shown on hover */}
                            <Box 
                              sx={{ 
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                bgcolor: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                '&:hover': {
                                  opacity: 1
                                },
                                borderRadius: '4px'
                              }}
                            >
                              <Typography variant="body2">
                                {tag.description}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  
                  {filteredTags.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No tags found matching your filter
                      </Typography>
                    </Box>
                  )}
                  
                  {filteredTags.length > ITEMS_PER_PAGE && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                      <Pagination 
                        count={Math.ceil(filteredTags.length / ITEMS_PER_PAGE)} 
                        page={tagPage}
                        onChange={handleTagPageChange}
                        color="primary"
                      />
                    </Box>
                  )}
                </Box>
              )}

              {/* Company Services Section */}
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Manage Company Services
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Define the services your company offers to clients. These can be used in invoices and proposals.
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <TextField
                      placeholder="Filter services..."
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
                    >
                      Add New Service
                    </Button>
                  </Box>

                  <Grid container spacing={2}>
                    {paginatedServices.map((service) => (
                      <Grid item xs={12} sm={6} md={4} key={service.id}>
                        <Card 
                          variant="outlined" 
                          sx={{ 
                            height: '100%',
                            '&:hover': {
                              boxShadow: 2
                            },
                            position: 'relative'
                          }}
                        >
                          <CardContent sx={{ pb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Typography variant="h6">
                                {service.name}
                              </Typography>
                              <Box>
                                <Tooltip title="Edit">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleEditService(service)}
                                    sx={{ mr: 0.5 }}
                                  >
                                    <Edit size={16} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleServiceDelete(service)}
                                  >
                                    <Trash2 size={16} />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                            
                            {/* Description shown on hover */}
                            <Box 
                              sx={{ 
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                bgcolor: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                '&:hover': {
                                  opacity: 1
                                },
                                borderRadius: '4px'
                              }}
                            >
                              <Typography variant="body2">
                                {service.description}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  
                  {filteredServices.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No services found matching your filter
                      </Typography>
                    </Box>
                  )}
                  
                  {filteredServices.length > ITEMS_PER_PAGE && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                      <Pagination 
                        count={Math.ceil(filteredServices.length / ITEMS_PER_PAGE)} 
                        page={servicePage}
                        onChange={handleServicePageChange}
                        color="primary"
                      />
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* Tag Add/Edit Dialog */}
      <Dialog
        open={tagDialogOpen}
        onClose={() => setTagDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{isTagEditMode ? 'Edit Tag' : 'Add New Tag'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Tag Name"
              name="name"
              value={currentTag.name}
              onChange={handleTagInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={currentTag.description}
              onChange={handleTagInputChange}
              margin="normal"
              multiline
              rows={4}
              helperText="Description will be shown when hovering over the tag"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTagDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleTagSave} 
            color="primary" 
            variant="contained"
            disabled={!currentTag.name.trim()}
          >
            {isTagEditMode ? 'Save Changes' : 'Add Tag'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tag Delete Confirmation Dialog */}
      <Dialog
        open={tagDeleteConfirmOpen}
        onClose={() => setTagDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Tag</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the tag "{currentTag?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTagDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmTagDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Service Add/Edit Dialog */}
      <Dialog
        open={serviceDialogOpen}
        onClose={() => setServiceDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{isServiceEditMode ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Service Name"
              name="name"
              value={currentService.name}
              onChange={handleServiceInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={currentService.description}
              onChange={handleServiceInputChange}
              margin="normal"
              multiline
              rows={4}
              required
              helperText="Description will be shown when hovering over the service"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setServiceDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleServiceSave} 
            color="primary" 
            variant="contained"
            disabled={!currentService.name.trim() || !currentService.description.trim()}
          >
            {isServiceEditMode ? 'Save Changes' : 'Add Service'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Service Delete Confirmation Dialog */}
      <Dialog
        open={serviceDeleteConfirmOpen}
        onClose={() => setServiceDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Service</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the service "{currentService?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setServiceDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmServiceDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default Settings;
