import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Divider,
  Avatar,
  AvatarGroup,
  CircularProgress,
  Alert
} from '@mui/material';
import { Plus, Search, Edit, Trash2, Users, Building } from 'lucide-react';
import mockApi from '../services/mockApi';

const CustomLists = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  
  // API data states
  const [customLists, setCustomLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch custom lists from API
  useEffect(() => {
    const fetchCustomLists = async () => {
      try {
        setLoading(true);
        const data = await mockApi.customLists.getAll();
        setCustomLists(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching custom lists:', err);
        setError('Failed to load custom lists. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomLists();
  }, []);

  // Filter lists based on search term
  const filteredLists = customLists.filter(list => 
    list.name.toLowerCase().includes(search.toLowerCase()) ||
    list.description.toLowerCase().includes(search.toLowerCase()) ||
    (list.tags && list.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
  );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleDeleteList = async (id) => {
    try {
      await mockApi.customLists.delete(id);
      // Update the local state after successful deletion
      setCustomLists(prevLists => prevLists.filter(list => list.id !== id));
    } catch (err) {
      console.error('Error deleting custom list:', err);
      // Show error notification (could be implemented with a snackbar)
    }
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
          <Alert severity="error">{error}</Alert>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1">
              Custom Lists
            </Typography>
            <Button
              variant="contained"
              startIcon={<Plus size={16} />}
              onClick={() => navigate('/custom-lists/create')}
            >
              Create List
            </Button>
          </Box>

          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Search lists..."
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <Search size={20} style={{ marginRight: 8, color: 'gray' }} />
              }}
            />
          </Box>

          <Grid container spacing={3}>
            {filteredLists.length > 0 ? (
              filteredLists.map((list) => (
                <Grid item xs={12} sm={6} md={4} key={list.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {list.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {list.description}
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Users size={16} style={{ marginRight: 8 }} />
                        <Typography variant="body2">
                          {list.contactCount} contacts
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Building size={16} style={{ marginRight: 8 }} />
                        <Typography variant="body2">
                          {list.companies && list.companies.length > 0 
                            ? `${list.companies.length} companies` 
                            : 'No companies'}
                        </Typography>
                      </Box>
                      
                      {list.tags && list.tags.length > 0 && (
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {list.tags.map(tag => (
                            <Chip 
                              key={tag} 
                              label={tag} 
                              size="small" 
                              sx={{ mt: 0.5 }} 
                            />
                          ))}
                        </Stack>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        onClick={() => navigate(`/custom-lists/${list.id}`)}
                      >
                        View
                      </Button>
                      <Button 
                        size="small" 
                        color="primary"
                        onClick={() => navigate(`/custom-lists/${list.id}/edit`)}
                      >
                        Edit
                      </Button>
                      <Box sx={{ flexGrow: 1 }} />
                      <Tooltip title="Delete list">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteList(list.id)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No custom lists found. Create your first list to get started.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>
    </motion.div>
  );
};

export default CustomLists;
