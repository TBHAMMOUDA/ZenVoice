import React, { useState, useMemo, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  IconButton,
  Tooltip,
  Chip,
  Autocomplete,
  Menu,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import { Plus, Phone, Mail, Building, Search, Check, UserPlus, Download, ChevronDown, List, Filter } from 'lucide-react';
import mockApi from '../services/mockApi';

const ITEMS_PER_PAGE = 25;

const Contacts = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // State for API data
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const data = await mockApi.contacts.getAll();
        setContacts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setError('Failed to load contacts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Extract unique companies and tags from contacts
  const companies = useMemo(() => {
    return [...new Set(contacts.map(contact => contact.company))];
  }, [contacts]);

  const tags = useMemo(() => {
    const allTags = contacts.flatMap(contact => contact.tags || []);
    return [...new Set(allTags)];
  }, [contacts]);

  // Filter and search contacts
  const filteredContacts = useMemo(() => {
    return contacts
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
  }, [contacts, search, filter, selectedCompanies, selectedTags]);

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

  const handleCustomListsClick = () => {
    navigate('/custom-lists');
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
              Contacts
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<List size={16} />}
                onClick={handleCustomListsClick}
              >
                Custom Lists
              </Button>
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
            </Stack>
          </Box>

          {/* Filters section - matching Invoices page style */}
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
                <FormControl fullWidth size="small">
                  <InputLabel id="contact-type-filter-label">Contact Type</InputLabel>
                  <Select
                    labelId="contact-type-filter-label"
                    value={filter}
                    label="Contact Type"
                    onChange={(e) => handleFilterChange(null, e.target.value)}
                    sx={{ '& .MuiInputBase-root': { fontSize: '0.9rem' } }}
                  >
                    <MenuItem value="all">All Contacts</MenuItem>
                    <MenuItem value="synced">Synced</MenuItem>
                    <MenuItem value="manual">Manual</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  startIcon={<Filter size={16} />}
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  sx={{ height: '40px', fontSize: '0.85rem' }}
                >
                  {showAdvancedFilters ? 'Hide Filters' : 'More Filters'}
                </Button>
              </Grid>
            </Grid>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Autocomplete
                      multiple
                      size="small"
                      options={companies}
                      value={selectedCompanies}
                      onChange={handleCompanyChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Companies"
                          placeholder="Filter by company..."
                          sx={{ '& .MuiInputBase-root': { fontSize: '0.9rem' } }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        onClick={() => {
                          setSearch('');
                          setFilter('all');
                          setSelectedCompanies([]);
                          setSelectedTags([]);
                          setPage(1);
                        }}
                        size="small"
                      >
                        Clear Filters
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>

          {/* Contacts grid with responsive layout and tags list on the right */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <Grid container spacing={3}>
                {paginatedContacts.map((contact) => (
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
            </Grid>
            
            {/* Tags list on the right */}
            <Grid item xs={12} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Tags</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                </CardContent>
              </Card>
            </Grid>
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
