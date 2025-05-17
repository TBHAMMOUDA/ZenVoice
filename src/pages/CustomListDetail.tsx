import React, { useState } from 'react';
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
  Alert
} from '@mui/material';
import { ArrowLeft, Edit, Trash2, Mail, Phone, Building, AlertTriangle } from 'lucide-react';
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

const CustomListDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Find the custom list by ID
  const customList = mockCustomLists.find(list => list.id === id);

  // If list not found, show error
  if (!customList) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            Custom list not found
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowLeft size={16} />}
            onClick={() => navigate('/custom-lists')}
            sx={{ mt: 2 }}
          >
            Back to Lists
          </Button>
        </Box>
      </Container>
    );
  }

  // Get contacts in this list
  const listContacts = mockContacts.filter(contact => 
    customList.contactIds.includes(contact.id)
  );

  // Get unique companies in this list
  const companies = [...new Set(listContacts.map(contact => contact.company))];

  // Check if contacts are from different companies
  const hasMultipleCompanies = companies.length > 1;

  const handleEditList = () => {
    navigate(`/custom-lists/${id}/edit`);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // This would typically delete the list and redirect
    console.log(`Deleting list ${id}`);
    setDeleteDialogOpen(false);
    navigate('/custom-lists');
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
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
              onClick={() => navigate('/custom-lists')}
              sx={{ mr: 2 }}
            >
              Back to Lists
            </Button>
          </Box>

          {/* List header with title and actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
            <Box>
              <Typography variant="h4" component="h1">
                {customList.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {customList.description}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                {customList.tags.map(tag => (
                  <Chip 
                    key={tag} 
                    label={tag} 
                    size="small" 
                    sx={{ borderRadius: '4px' }} 
                  />
                ))}
              </Box>
            </Box>
            
            <Box>
              <Button
                variant="outlined"
                startIcon={<Edit size={16} />}
                onClick={handleEditList}
                sx={{ mr: 1 }}
              >
                Edit List
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Trash2 size={16} />}
                onClick={handleDeleteClick}
              >
                Delete
              </Button>
            </Box>
          </Box>

          {/* List metadata */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body1">
                    {new Date(customList.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {new Date(customList.updatedAt).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Contacts
                  </Typography>
                  <Typography variant="body1">
                    {listContacts.length}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Companies
                  </Typography>
                  <Typography variant="body1">
                    {companies.length}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Warning for multiple companies */}
          {hasMultipleCompanies && (
            <Alert 
              severity="warning" 
              icon={<AlertTriangle size={16} />}
              sx={{ mb: 4 }}
            >
              This list contains contacts from {companies.length} different companies
            </Alert>
          )}

          {/* Contacts in this list */}
          <Typography variant="h5" sx={{ mb: 3 }}>
            Contacts in this List
          </Typography>

          <Grid container spacing={3}>
            {listContacts.map((contact) => (
              <Grid item xs={12} sm={6} md={4} key={contact.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={contact.avatar}
                        alt={`${contact.firstName} ${contact.lastName}`}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                          {contact.firstName} {contact.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {contact.company}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Mail size={16} style={{ marginRight: 8 }} />
                      <Typography variant="body2">{contact.email}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone size={16} style={{ marginRight: 8 }} />
                      <Typography variant="body2">{contact.phone}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Building size={16} style={{ marginRight: 8 }} />
                      <Typography variant="body2">{contact.company}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {listContacts.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No contacts in this list
              </Typography>
              <Button
                variant="contained"
                onClick={handleEditList}
                sx={{ mt: 2 }}
              >
                Add Contacts
              </Button>
            </Box>
          )}
        </Box>
      </Container>

      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Custom List</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{customList.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default CustomListDetail;
