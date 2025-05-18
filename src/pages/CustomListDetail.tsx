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
  CircularProgress
} from '@mui/material';
import { ArrowLeft, Edit, Trash2, Mail, Phone, Building, AlertTriangle } from 'lucide-react';
import mockApi from '../services/mockApi';

const CustomListDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State for API data
  const [customList, setCustomList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch custom list details from API
  useEffect(() => {
    const fetchCustomList = async () => {
      try {
        setLoading(true);
        const data = await mockApi.customLists.getById(id);
        setCustomList(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching custom list details:', err);
        setError('Failed to load custom list details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomList();
    }
  }, [id]);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await mockApi.customLists.delete(id);
      setDeleteDialogOpen(false);
      navigate('/custom-lists');
    } catch (err) {
      console.error('Error deleting custom list:', err);
      setError('Failed to delete custom list. Please try again later.');
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Button
            startIcon={<ArrowLeft size={16} />}
            onClick={() => navigate('/custom-lists')}
            sx={{ mb: 2 }}
          >
            Back to Lists
          </Button>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  if (!customList) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Button
            startIcon={<ArrowLeft size={16} />}
            onClick={() => navigate('/custom-lists')}
            sx={{ mb: 2 }}
          >
            Back to Lists
          </Button>
          <Alert severity="warning">Custom list not found.</Alert>
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Button
              startIcon={<ArrowLeft size={16} />}
              onClick={() => navigate('/custom-lists')}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
              {customList.name}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Edit size={16} />}
              onClick={() => navigate(`/custom-lists/${id}/edit`)}
              sx={{ mr: 1 }}
            >
              Edit
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

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    List Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {customList.description}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Created
                    </Typography>
                    <Typography variant="body2">
                      {new Date(customList.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Last Updated
                    </Typography>
                    <Typography variant="body2">
                      {new Date(customList.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  {customList.tags && customList.tags.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Tags
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {customList.tags.map(tag => (
                          <Chip 
                            key={tag} 
                            label={tag} 
                            size="small" 
                            sx={{ mt: 0.5 }} 
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Contacts ({customList.contacts ? customList.contacts.length : 0})
                    </Typography>
                  </Box>
                  
                  {customList.contacts && customList.contacts.length > 0 ? (
                    <Grid container spacing={2}>
                      {customList.contacts.map(contact => (
                        <Grid item xs={12} sm={6} key={contact.id}>
                          <Card variant="outlined">
                            <CardContent sx={{ p: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Avatar
                                  src={contact.avatar}
                                  alt={`${contact.firstName} ${contact.lastName}`}
                                  sx={{ width: 40, height: 40, mr: 2 }}
                                />
                                <Box>
                                  <Typography variant="subtitle1">
                                    {contact.firstName} {contact.lastName}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {contact.company}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Mail size={14} style={{ marginRight: 8 }} />
                                <Typography variant="body2">{contact.email}</Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Phone size={14} style={{ marginRight: 8 }} />
                                <Typography variant="body2">{contact.phone}</Typography>
                              </Box>
                              
                              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                  size="small"
                                  onClick={() => navigate(`/contacts/${contact.id}`)}
                                >
                                  View
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <AlertTriangle size={24} style={{ marginBottom: 8, color: 'orange' }} />
                      <Typography variant="body1" color="text.secondary">
                        No contacts in this list.
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
      
      {/* Delete Confirmation Dialog */}
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
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default CustomListDetail;
