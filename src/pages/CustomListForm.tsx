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
  Paper
} from '@mui/material';
import { ArrowLeft, Save, AlertTriangle, X, Check, Users, Building } from 'lucide-react';
import { mockContacts } from '../data/mockData';

// Mock data for custom lists
const mockCustomLists = [
  {
    id: '1',
    name: 'Sales Team Contacts',
    description: 'Key contacts for the sales department',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-20',
    contactIds: ['1', '2', '4', '6'],
    tags: ['sales', 'priority']
  },
  {
    id: '2',
    name: 'Marketing Partners',
    description: 'External marketing agencies and partners',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-18',
    contactIds: ['3', '5'],
    tags: ['marketing', 'external']
  },
  {
    id: '3',
    name: 'Technical Support',
    description: 'Technical support contacts for all products',
    createdAt: '2024-03-05',
    updatedAt: '2024-03-15',
    contactIds: ['1', '3', '4', '5', '6'],
    tags: ['support', 'technical']
  },
  {
    id: '4',
    name: 'Executive Team',
    description: 'Executive contacts across partner companies',
    createdAt: '2024-02-28',
    updatedAt: '2024-03-10',
    contactIds: ['2', '3', '5'],
    tags: ['executive', 'priority']
  }
];

const CustomListForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  
  // Validation state
  const [nameError, setNameError] = useState('');
  const [hasMultipleCompanies, setHasMultipleCompanies] = useState(false);
  const [companies, setCompanies] = useState([]);
  
  // Dialog states
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  
  // Initialize form data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const customList = mockCustomLists.find(list => list.id === id);
      if (customList) {
        setName(customList.name);
        setDescription(customList.description);
        setSelectedContacts(customList.contactIds);
        setTags(customList.tags);
      }
    }
  }, [id, isEditMode]);
  
  // Check for multiple companies whenever selected contacts change
  useEffect(() => {
    if (selectedContacts.length > 0) {
      const selectedContactsData = mockContacts.filter(contact => 
        selectedContacts.includes(contact.id)
      );
      
      const uniqueCompanies = [...new Set(selectedContactsData.map(contact => contact.company))];
      setCompanies(uniqueCompanies);
      setHasMultipleCompanies(uniqueCompanies.length > 1);
    } else {
      setCompanies([]);
      setHasMultipleCompanies(false);
    }
  }, [selectedContacts]);
  
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (!value.trim()) {
      setNameError('List name is required');
    } else {
      setNameError('');
    }
  };
  
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  
  const handleContactsChange = (event) => {
    const value = event.target.value;
    setSelectedContacts(value);
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };
  
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleCancel = () => {
    // If form has changes, show confirmation dialog
    if (name || description || selectedContacts.length > 0 || tags.length > 0) {
      setCancelDialogOpen(true);
    } else {
      navigate('/custom-lists');
    }
  };
  
  const handleCancelConfirm = () => {
    setCancelDialogOpen(false);
    navigate('/custom-lists');
  };
  
  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
  };
  
  const handleSave = () => {
    // Validate form
    if (!name.trim()) {
      setNameError('List name is required');
      return;
    }
    
    // If multiple companies, show confirmation dialog
    if (hasMultipleCompanies) {
      setSaveDialogOpen(true);
    } else {
      // Save directly if no warnings
      saveList();
    }
  };
  
  const handleSaveConfirm = () => {
    setSaveDialogOpen(false);
    saveList();
  };
  
  const handleSaveDialogClose = () => {
    setSaveDialogOpen(false);
  };
  
  const saveList = () => {
    // In a real app, this would save to backend
    console.log('Saving list:', {
      id: isEditMode ? id : Date.now().toString(),
      name,
      description,
      contactIds: selectedContacts,
      tags,
      createdAt: isEditMode ? mockCustomLists.find(list => list.id === id)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Navigate back to list view
    navigate('/custom-lists');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Header with back button */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Button
              startIcon={<ArrowLeft size={16} />}
              onClick={handleCancel}
              sx={{ mr: 2 }}
            >
              Back to Lists
            </Button>
          </Box>
          
          {/* Form header */}
          <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
            {isEditMode ? 'Edit Custom List' : 'Create New Custom List'}
          </Typography>
          
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3}>
              {/* List name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="List Name"
                  value={name}
                  onChange={handleNameChange}
                  error={Boolean(nameError)}
                  helperText={nameError}
                  required
                />
              </Grid>
              
              {/* List description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={description}
                  onChange={handleDescriptionChange}
                  multiline
                  rows={3}
                />
              </Grid>
              
              {/* Contact selection */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="contacts-select-label">Select Contacts</InputLabel>
                  <Select
                    labelId="contacts-select-label"
                    multiple
                    value={selectedContacts}
                    onChange={handleContactsChange}
                    input={<OutlinedInput label="Select Contacts" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((contactId) => {
                          const contact = mockContacts.find(c => c.id === contactId);
                          return contact ? (
                            <Chip 
                              key={contactId} 
                              label={`${contact.firstName} ${contact.lastName}`} 
                              size="small" 
                            />
                          ) : null;
                        })}
                      </Box>
                    )}
                  >
                    {mockContacts.map((contact) => (
                      <MenuItem key={contact.id} value={contact.id}>
                        <Checkbox checked={selectedContacts.includes(contact.id)} />
                        <ListItemText 
                          primary={`${contact.firstName} ${contact.lastName}`} 
                          secondary={contact.company} 
                        />
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {selectedContacts.length} contacts selected
                  </FormHelperText>
                </FormControl>
              </Grid>
              
              {/* Warning for multiple companies */}
              {hasMultipleCompanies && (
                <Grid item xs={12}>
                  <Alert 
                    severity="warning" 
                    icon={<AlertTriangle size={16} />}
                  >
                    This list contains contacts from {companies.length} different companies: {companies.join(', ')}
                  </Alert>
                </Grid>
              )}
              
              {/* Tags */}
              <Grid item xs={12}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">Tags</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    size="small"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Add a tag"
                    sx={{ mr: 1 }}
                  />
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                  >
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleDeleteTag(tag)}
                      size="small"
                    />
                  ))}
                </Box>
              </Grid>
              
              {/* Summary */}
              {selectedContacts.length > 0 && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ mt: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        List Summary
                      </Typography>
                      <Stack direction="row" spacing={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Users size={16} style={{ marginRight: 8, color: 'gray' }} />
                          <Typography variant="body2">
                            {selectedContacts.length} contacts
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Building size={16} style={{ marginRight: 8, color: 'gray' }} />
                          <Typography variant="body2">
                            {companies.length} companies
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Paper>
          
          {/* Action buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save size={16} />}
              onClick={handleSave}
              disabled={!name.trim() || selectedContacts.length === 0}
            >
              {isEditMode ? 'Save Changes' : 'Create List'}
            </Button>
          </Box>
        </Box>
      </Container>
      
      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCancelDialogClose}
      >
        <DialogTitle>Discard Changes?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes. Are you sure you want to discard them?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose}>No, Keep Editing</Button>
          <Button onClick={handleCancelConfirm} color="error">
            Yes, Discard
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Save Confirmation Dialog for Multiple Companies */}
      <Dialog
        open={saveDialogOpen}
        onClose={handleSaveDialogClose}
      >
        <DialogTitle>Confirm List with Multiple Companies</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This list contains contacts from {companies.length} different companies: {companies.join(', ')}. 
            Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveDialogClose}>Cancel</Button>
          <Button onClick={handleSaveConfirm} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default CustomListForm;
