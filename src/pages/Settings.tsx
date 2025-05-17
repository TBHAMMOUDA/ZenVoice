import React, { useState } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Tab,
  Tabs
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
  Briefcase
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Mock data for tags and services
const initialTags = [
  { id: '1', name: 'enterprise' },
  { id: '2', name: 'tech' },
  { id: '3', name: 'startup' },
  { id: '4', name: 'mobile' },
  { id: '5', name: 'ai' },
  { id: '6', name: 'consulting' },
  { id: '7', name: 'design' },
  { id: '8', name: 'creative' },
  { id: '9', name: 'security' }
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
  }
];

const Settings = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  
  // Tags state
  const [tags, setTags] = useState(initialTags);
  const [newTagMode, setNewTagMode] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [tagDeleteConfirmOpen, setTagDeleteConfirmOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  
  // Services state
  const [services, setServices] = useState(initialServices);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [serviceDeleteConfirmOpen, setServiceDeleteConfirmOpen] = useState(false);
  const [currentService, setCurrentService] = useState({ id: '', name: '', description: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Tab handling
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Tags handlers
  const handleAddTagClick = () => {
    setNewTagMode(true);
  };
  
  const handleTagInputChange = (e) => {
    setNewTagName(e.target.value);
  };
  
  const handleTagCancel = () => {
    setNewTagMode(false);
    setNewTagName('');
  };
  
  const handleTagConfirm = () => {
    if (newTagName.trim()) {
      const newTag = {
        id: Date.now().toString(),
        name: newTagName.trim()
      };
      setTags([...tags, newTag]);
      setNewTagMode(false);
      setNewTagName('');
    }
  };
  
  const handleTagDelete = (tag) => {
    setTagToDelete(tag);
    setTagDeleteConfirmOpen(true);
  };
  
  const confirmTagDelete = () => {
    if (tagToDelete) {
      setTags(tags.filter(tag => tag.id !== tagToDelete.id));
      setTagDeleteConfirmOpen(false);
      setTagToDelete(null);
    }
  };
  
  // Services handlers
  const handleAddService = () => {
    setCurrentService({ id: '', name: '', description: '' });
    setIsEditMode(false);
    setServiceDialogOpen(true);
  };
  
  const handleEditService = (service) => {
    setCurrentService(service);
    setIsEditMode(true);
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
      if (isEditMode) {
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

                  <List>
                    {/* Add New Tag Item */}
                    <ListItem 
                      sx={{ 
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 2
                      }}
                    >
                      {newTagMode ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Enter tag name"
                            value={newTagName}
                            onChange={handleTagInputChange}
                            autoFocus
                          />
                          <IconButton color="primary" onClick={handleTagConfirm}>
                            <Check size={18} />
                          </IconButton>
                          <IconButton color="error" onClick={handleTagCancel}>
                            <X size={18} />
                          </IconButton>
                        </Box>
                      ) : (
                        <>
                          <ListItemText 
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Plus size={16} style={{ marginRight: 8 }} />
                                <Typography variant="body1">Add New Tag</Typography>
                              </Box>
                            } 
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={handleAddTagClick}>
                              <Plus size={18} />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </>
                      )}
                    </ListItem>

                    {/* Tag List */}
                    {tags.map((tag) => (
                      <ListItem 
                        key={tag.id}
                        sx={{ 
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          py: 1
                        }}
                      >
                        <ListItemText 
                          primary={
                            <Chip 
                              label={tag.name} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                              sx={{ borderRadius: '4px' }}
                            />
                          } 
                        />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            color="error" 
                            onClick={() => handleTagDelete(tag)}
                            size="small"
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
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

                  <Button
                    variant="outlined"
                    startIcon={<Plus size={16} />}
                    onClick={handleAddService}
                    sx={{ mb: 3 }}
                  >
                    Add New Service
                  </Button>

                  <Grid container spacing={2}>
                    {services.map((service) => (
                      <Grid item xs={12} sm={6} md={4} key={service.id}>
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
                              <Typography variant="h6" gutterBottom>
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
                            <Typography variant="body2" color="text.secondary">
                              {service.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* Tag Delete Confirmation Dialog */}
      <Dialog
        open={tagDeleteConfirmOpen}
        onClose={() => setTagDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Tag</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the tag "{tagToDelete?.name}"? This action cannot be undone.
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
        <DialogTitle>{isEditMode ? 'Edit Service' : 'Add New Service'}</DialogTitle>
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
            {isEditMode ? 'Save Changes' : 'Add Service'}
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
