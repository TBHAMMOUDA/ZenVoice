import React, { useState, useMemo } from 'react';
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
  Avatar,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Pagination,
  IconButton,
  Tooltip,
  Chip,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Menu
} from '@mui/material';
import { Plus, Phone, Mail, Building, Search, Check, UserPlus, Download, ChevronDown } from 'lucide-react';
import { mockContacts } from '../data/mockData';

const ITEMS_PER_PAGE = 25; // Increased from 6 to 25

const Contacts = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  // Extract unique companies and tags from mockContacts
  const companies = useMemo(() => {
    return [...new Set(mockContacts.map(contact => contact.company))];
  }, []);

  const tags = useMemo(() => {
    const allTags = mockContacts.flatMap(contact => contact.tags || []);
    return [...new Set(allTags)];
  }, []);

  // Filter and search contacts
  const filteredContacts = useMemo(() => {
    return mockContacts
      .filter(contact => {
        // Global text search (expanded to include name, email, and phone)
        const matchesSearch = (
          contact.firstName.toLowerCase().includes(search.toLowerCase()) ||
          contact.lastName.toLowerCase().includes(search.toLowerCase()) ||
          contact.email.toLowerCase().includes(search.toLowerCase()) ||
          contact.phone.toLowerCase().includes(search.toLowerCase())
        );
        
        // Synced/Manual filter
        const matchesFilter = 
          filter === 'all' || 
          (filter === 'synced' && contact.synced) || 
          (filter === 'manual' && !contact.synced);
        
        // Company filter
        const matchesCompany = 
          selectedCompanies.length === 0 || 
          selectedCompanies.includes(contact.company);
        
        // Tags filter
        const matchesTags = 
          selectedTags.length === 0 || 
          (contact.tags && contact.tags.some(tag => selectedTags.includes(tag)));
        
        return matchesSearch && matchesFilter && matchesCompany && matchesTags;
      });
  }, [search, filter, selectedCompanies, selectedTags]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);
  const paginatedContacts = filteredContacts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
      setPage(1);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCompanyChange = (event, newValue) => {
    setSelectedCompanies(newValue);
    setPage(1);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
    setPage(1);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExport = () => {
    // Export functionality would go here
    console.log('Exporting contacts...');
    handleMenuClose();
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
              Contacts
            </Typography>
            <Box>
              <Button
                variant="contained"
                endIcon={<ChevronDown size={16} />}
                onClick={handleMenuOpen}
              >
                Actions
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { navigate('/contacts/create'); handleMenuClose(); }}>
                  <UserPlus size={16} style={{ marginRight: 8 }} />
                  Add New Contact
                </MenuItem>
                <MenuItem onClick={handleExport}>
                  <Download size={16} style={{ marginRight: 8 }} />
                  Export Contacts
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Filters section - aligned horizontally with reduced sizes */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Search name, email, phone..."
                  value={search}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <Search size={16} style={{ marginRight: 8, color: 'gray' }} />
                  }}
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.9rem' } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  multiple
                  size="small"
                  options={companies}
                  value={selectedCompanies}
                  onChange={handleCompanyChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Filter by company..."
                      sx={{ '& .MuiInputBase-root': { fontSize: '0.9rem' } }}
                    />
                  )}
                  sx={{ minWidth: 200 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <ToggleButtonGroup
                  size="small"
                  value={filter}
                  exclusive
                  onChange={handleFilterChange}
                  aria-label="contact filter"
                  sx={{ height: '40px' }}
                >
                  <ToggleButton value="all" sx={{ fontSize: '0.85rem' }}>
                    All
                  </ToggleButton>
                  <ToggleButton value="synced" sx={{ fontSize: '0.85rem' }}>
                    Synced
                  </ToggleButton>
                  <ToggleButton value="manual" sx={{ fontSize: '0.85rem' }}>
                    Manual
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>
          </Box>

          {/* Tags filter section */}
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map(tag => (
              <Chip
                key={tag}
                label={tag}
                clickable
                color={selectedTags.includes(tag) ? "primary" : "default"}
                onClick={() => handleTagToggle(tag)}
                size="small"
                sx={{ 
                  borderRadius: '4px',
                  height: '28px',
                  fontSize: '0.8rem'
                }}
              />
            ))}
          </Box>

          {/* Contacts grid with responsive layout */}
          <Grid container spacing={3}>
            {paginatedContacts.map((contact) => (
              <Grid item xs={12} sm={6} md={3} key={contact.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={contact.avatar}
                        alt={`${contact.firstName} ${contact.lastName}`}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                            {contact.firstName} {contact.lastName}
                          </Typography>
                          {contact.synced && (
                            <Tooltip title="Synced Contact">
                              <Check size={16} style={{ color: 'green' }} />
                            </Tooltip>
                          )}
                        </Box>
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

                    {/* Display tags */}
                    {contact.tags && contact.tags.length > 0 && (
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {contact.tags.map(tag => (
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
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(`/contacts/${contact.id}`)}
                    >
                      View Details
                    </Button>
                    {!contact.synced && (
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/contacts/${contact.id}/edit`)}
                      >
                        Edit
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Enhanced pagination controls */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                siblingCount={1}
              />
            </Box>
          )}
        </Box>
      </Container>
    </motion.div>
  );
};

export default Contacts;
