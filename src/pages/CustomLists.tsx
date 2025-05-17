import React, { useState } from 'react';
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
  AvatarGroup
} from '@mui/material';
import { Plus, Search, Edit, Trash2, Users, Building } from 'lucide-react';

// Mock data for custom lists
const mockCustomLists = [
  {
    id: '1',
    name: 'Sales Team Contacts',
    description: 'Key contacts for the sales department',
    createdAt: '2024-03-15',
    contactCount: 8,
    companies: ['Tech Solutions Inc.', 'Digital Dynamics LLC'],
    tags: ['sales', 'priority']
  },
  {
    id: '2',
    name: 'Marketing Partners',
    description: 'External marketing agencies and partners',
    createdAt: '2024-03-10',
    contactCount: 5,
    companies: ['Creative Design Co', 'Innovative Systems Corp'],
    tags: ['marketing', 'external']
  },
  {
    id: '3',
    name: 'Technical Support',
    description: 'Technical support contacts for all products',
    createdAt: '2024-03-05',
    contactCount: 12,
    companies: ['Tech Solutions Inc.', 'Security First Inc', 'Global Solutions Ltd'],
    tags: ['support', 'technical']
  },
  {
    id: '4',
    name: 'Executive Team',
    description: 'Executive contacts across partner companies',
    createdAt: '2024-02-28',
    contactCount: 6,
    companies: ['Tech Solutions Inc.', 'Digital Dynamics LLC', 'Innovative Systems Corp'],
    tags: ['executive', 'priority']
  }
];

const CustomLists = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Filter lists based on search
  const filteredLists = mockCustomLists.filter(list => 
    list.name.toLowerCase().includes(search.toLowerCase()) ||
    list.description.toLowerCase().includes(search.toLowerCase()) ||
    list.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleCreateList = () => {
    navigate('/custom-lists/create');
  };

  const handleViewList = (id) => {
    navigate(`/custom-lists/${id}`);
  };

  const handleEditList = (id, event) => {
    event.stopPropagation();
    navigate(`/custom-lists/${id}/edit`);
  };

  const handleDeleteList = (id, event) => {
    event.stopPropagation();
    // This would typically show a confirmation modal
    console.log(`Delete list ${id}`);
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1">
              Custom Contact Lists
            </Typography>
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={handleCreateList}
            >
              Create New List
            </Button>
          </Box>

          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search lists..."
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <Search size={16} style={{ marginRight: 8, color: 'gray' }} />
              }}
              sx={{ maxWidth: 400 }}
            />
          </Box>

          <Grid container spacing={3}>
            {filteredLists.map((list) => (
              <Grid item xs={12} md={6} key={list.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => handleViewList(list.id)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">{list.name}</Typography>
                      <Box>
                        <Tooltip title="Edit List">
                          <IconButton 
                            size="small" 
                            onClick={(e) => handleEditList(list.id, e)}
                          >
                            <Edit size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete List">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={(e) => handleDeleteList(list.id, e)}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {list.description}
                    </Typography>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Users size={16} style={{ marginRight: 8, color: 'gray' }} />
                        <Typography variant="body2">
                          {list.contactCount} contacts
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Building size={16} style={{ marginRight: 8, color: 'gray' }} />
                        <Typography variant="body2">
                          {list.companies.length} companies
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {list.tags.map(tag => (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          size="small" 
                          sx={{ 
                            height: '20px', 
                            fontSize: '0.7rem',
                            borderRadius: '4px'
                          }} 
                        />
                      ))}
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary">
                      Created on {new Date(list.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleViewList(list.id)}>
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {filteredLists.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary">
                No custom lists found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Create a new list to organize your contacts
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={handleCreateList}
                sx={{ mt: 2 }}
              >
                Create New List
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </motion.div>
  );
};

export default CustomLists;
