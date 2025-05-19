import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Autocomplete,
  Chip,
  Stack,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  MenuItem,
  Select,
  FormHelperText,
  Paper,
  CircularProgress
} from '@mui/material';
import { ArrowLeft, Save, AlertTriangle, X, Check, Users, Building } from 'lucide-react';
import mockApi from '../services/mockApi';

const CustomListForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contactIds: [],
    tags: []
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  
  // API data states
  const [contacts, setContacts] = useState([]);
  const [customList, setCustomList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Dialog state
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);

  // Fetch contacts and custom list (if in edit mode) from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch contacts
        const contactsData = await mockApi.contacts.getAll();
        setContacts(contactsData);
        
        // If in edit mode, fetch custom list details
        if (isEditMode && id) {
          const listData = await mockApi.customLists.getById(id);
          setCustomList(listData);
          setFormData({
            name: listData.name,
            description: listData.description,
            contactIds: listData.contactIds,
            tags: listData.tags
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.contactIds.length === 0) {
      newErrors.contactIds = 'At least one contact must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleContactsChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      contactIds: value
    }));
    
    // Clear error for contacts if it exists
    if (errors.contactIds) {
      setErrors(prev => ({
        ...prev,
        contactIds: undefined
      }));
    }
  };

  const handleTagsChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      tags: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      if (isEditMode) {
        // Update existing list
        await mockApi.customLists.update(id, formData);
      } else {
        // Create new list
        await mockApi.customLists.create(formData);
      }
      
      navigate('/custom-lists');
    } catch (err) {
      console.error('Error saving custom list:', err);
      setError('Failed to save custom list. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDiscard = () => {
    setDiscardDialogOpen(true);
  };

  const handleDiscardConfirm = () => {
    setDiscardDialogOpen(false);
    navigate('/custom-lists');
  };

  const handleDiscardCancel = () => {
    setDiscardDialogOpen(false);
  };

  // Get all unique tags from contacts for suggestions
  const tagSuggestions = React.useMemo(() => {
    const allTags = contacts.flatMap(contact => contact.tags || []);
    return [...new Set(allTags)];
  }, [contacts]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Button
              startIcon={<ArrowLeft size={16} />}
              onClick={() => navigate('/custom-lists')}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Typography variant="h4" component="h1">
              {isEditMode ? 'Edit Custom List' : 'Create Custom List'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      List Information
                    </Typography>
                    
                    <TextField
                      fullWidth
                      label="List Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      error={Boolean(errors.name)}
                      helperText={errors.name}
                      margin="normal"
                      required
                    />
                    
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      multiline
                      rows={3}
                      margin="normal"
                    />
                    
                    <Autocomplete
                      multiple
                      freeSolo
                      options={tagSuggestions}
                      value={formData.tags}
                      onChange={handleTagsChange}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            label={option}
                            {...getTagProps({ index })}
                            size="small"
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tags"
                          placeholder="Add tags..."
                          margin="normal"
                          helperText="Press Enter to add a new tag"
                        />
                      )}
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Actions
                    </Typography>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      startIcon={<Save size={16} />}
                      type="submit"
                      disabled={submitting}
                      sx={{ mb: 2 }}
                    >
                      {submitting ? 'Saving...' : 'Save List'}
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={handleDiscard}
                      disabled={submitting}
                    >
                      Discard Changes
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Select Contacts
                    </Typography>
                    
                    <FormControl 
                      fullWidth 
                      error={Boolean(errors.contactIds)}
                      sx={{ mt: 2 }}
                    >
                      <InputLabel id="contacts-select-label">Contacts</InputLabel>
                      <Select
                        labelId="contacts-select-label"
                        multiple
                        value={formData.contactIds}
                        onChange={handleContactsChange}
                        input={<OutlinedInput label="Contacts" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => {
                              const contact = contacts.find(c => c.id === value);
                              return contact ? (
                                <Chip 
                                  key={value} 
                                  label={`${contact.firstName} ${contact.lastName}`} 
                                  size="small" 
                                />
                              ) : null;
                            })}
                          </Box>
                        )}
                      >
                        {contacts.map((contact) => (
                          <MenuItem key={contact.id} value={contact.id}>
                            <Checkbox checked={formData.contactIds.indexOf(contact.id) > -1} />
                            <ListItemText 
                              primary={`${contact.firstName} ${contact.lastName}`} 
                              secondary={contact.company} 
                            />
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.contactIds && (
                        <FormHelperText>{errors.contactIds}</FormHelperText>
                      )}
                    </FormControl>
                    
                    {/* Preview selected contacts */}
                    {formData.contactIds.length > 0 && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Selected Contacts ({formData.contactIds.length})
                        </Typography>
                        <Grid container spacing={2}>
                          {formData.contactIds.map(contactId => {
                            const contact = contacts.find(c => c.id === contactId);
                            if (!contact) return null;
                            
                            return (
                              <Grid item xs={12} sm={6} md={4} key={contactId}>
                                <Paper 
                                  variant="outlined" 
                                  sx={{ p: 1, display: 'flex', alignItems: 'center' }}
                                >
                                  <Avatar
                                    src={contact.avatar}
                                    alt={`${contact.firstName} ${contact.lastName}`}
                                    sx={{ width: 32, height: 32, mr: 1 }}
                                  />
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2">
                                      {contact.firstName} {contact.lastName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {contact.company}
                                    </Typography>
                                  </Box>
                                </Paper>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
      
      {/* Discard Changes Dialog */}
      <Dialog
        open={discardDialogOpen}
        onClose={handleDiscardCancel}
      >
        <DialogTitle>Discard Changes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to discard your changes? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiscardCancel}>Cancel</Button>
          <Button onClick={handleDiscardConfirm} color="error" autoFocus>
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default CustomListForm;
