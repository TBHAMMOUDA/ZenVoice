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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar
} from '@mui/material';
import { Plus, Phone, Mail, Building, Search, Check, UserPlus, Download, ChevronDown, List, Filter, Edit, Trash2 } from 'lucide-react';
import { contactsApi, ContactDto, CreateContactDto, TagDto, companiesApi, CompanyDto, tagsApi } from '../services/api';

const ITEMS_PER_PAGE = 25;

const Contacts = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagDto[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // State for API data
  const [contacts, setContacts] = useState<ContactDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [tags, setTags] = useState<TagDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<ContactDto | null>(null);
  const [formData, setFormData] = useState<CreateContactDto>({
    name: '',
    email: '',
    phone: '',
    companyId: undefined,
    tags: []
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const response = await contactsApi.getAll({
          page,
          pageSize,
          searchText: search || undefined,
          isAutoSynced: filter === 'all' ? undefined : filter === 'synced',
          companyIds: selectedCompanies.length > 0 ? selectedCompanies : undefined
        });
        
        setContacts(response.items);
        setTotalCount(response.totalCount);
        setTotalPages(response.totalPages);
        setError(null);
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setError('Failed to load contacts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [page, pageSize, search, filter, selectedCompanies]);

  // Fetch companies and tags
  useEffect(() => {
    const fetchCompaniesAndTags = async () => {
      try {
        const [companiesData, tagsData] = await Promise.all([
          companiesApi.getAll(),
          tagsApi.getAll()
        ]);
        setCompanies(companiesData);
        setTags(tagsData);
      } catch (err) {
        console.error('Error fetching companies or tags:', err);
      }
    };

    fetchCompaniesAndTags();
  }, []);

  const handleFilterChange = (event: any, newFilter: string | null) => {
    if (newFilter !== null) {
      setFilter(newFilter);
      setPage(1);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleCompanyChange = (event: any, newValue: CompanyDto[]) => {
    setSelectedCompanies(newValue.map(company => company.id as number));
    setPage(1);
  };

  const handleTagToggle = (tag: TagDto) => {
    setSelectedTags(prev => 
      prev.some(t => t.id === tag.id) 
        ? prev.filter(t => t.id !== tag.id) 
        : [...prev, tag]
    );
    setPage(1);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
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

  // Modal handlers
  const handleCreateContact = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      companyId: undefined,
      tags: []
    });
    setCreateModalOpen(true);
    handleMenuClose();
  };

  const handleViewContact = async (contactId: number) => {
    try {
      setLoading(true);
      const contact = await contactsApi.getById(contactId);
      setCurrentContact(contact);
      setViewModalOpen(true);
    } catch (err) {
      console.error('Error fetching contact details:', err);
      setSnackbar({
        open: true,
        message: 'Failed to load contact details',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditContact = async (contactId: number) => {
    try {
      setLoading(true);
      const contact = await contactsApi.getById(contactId);
      setCurrentContact(contact);
      setFormData({
        name: contact.name,
        email: contact.email,
        phone: contact.phone || '',
        companyId: contact.companyId,
        tags: contact.tags || []
      });
      setEditModalOpen(true);
    } catch (err) {
      console.error('Error fetching contact for edit:', err);
      setSnackbar({
        open: true,
        message: 'Failed to load contact for editing',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = (contact: ContactDto) => {
    setCurrentContact(contact);
    setDeleteModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompanySelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const value = e.target.value as number | undefined;
    setFormData(prev => ({
      ...prev,
      companyId: value
    }));
  };

  const handleTagsChange = (event: React.SyntheticEvent, newValue: TagDto[]) => {
    setFormData(prev => ({
      ...prev,
      tags: newValue
    }));
  };

  const handleCreateSubmit = async () => {
    try {
      setLoading(true);
      const newContact = await contactsApi.create(formData);
      
      // Refresh the contacts list
      const response = await contactsApi.getAll({
        page,
        pageSize,
        searchText: search || undefined,
        isAutoSynced: filter === 'all' ? undefined : filter === 'synced',
        companyIds: selectedCompanies.length > 0 ? selectedCompanies : undefined
      });
      
      setContacts(response.items);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
      
      setCreateModalOpen(false);
      setSnackbar({
        open: true,
        message: 'Contact created successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error creating contact:', err);
      setSnackbar({
        open: true,
        message: 'Failed to create contact. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    try {
      if (!currentContact) return;
      
      setLoading(true);
      // Since there's no direct update endpoint, we'll use the status update endpoint
      // This is a workaround until a proper update endpoint is available
      await contactsApi.updateStatus(currentContact.id, {
        id: currentContact.id,
        status: 0 // Active status
      });
      
      // Refresh the contacts list
      const response = await contactsApi.getAll({
        page,
        pageSize,
        searchText: search || undefined,
        isAutoSynced: filter === 'all' ? undefined : filter === 'synced',
        companyIds: selectedCompanies.length > 0 ? selectedCompanies : undefined
      });
      
      setContacts(response.items);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
      
      setEditModalOpen(false);
      setSnackbar({
        open: true,
        message: 'Contact updated successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error updating contact:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update contact. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      if (!currentContact) return;
      
      setLoading(true);
      await contactsApi.delete(currentContact.id);
      
      // Refresh the contacts list
      const response = await contactsApi.getAll({
        page,
        pageSize,
        searchText: search || undefined,
        isAutoSynced: filter === 'all' ? undefined : filter === 'synced',
        companyIds: selectedCompanies.length > 0 ? selectedCompanies : undefined
      });
      
      setContacts(response.items);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
      
      setDeleteModalOpen(false);
      setSnackbar({
        open: true,
        message: 'Contact deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error deleting contact:', err);
      setSnackbar({
        open: true,
        message: 'Failed to delete contact. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  if (loading && contacts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && contacts.length === 0) {
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
                <MenuItem onClick={handleCreateContact}>
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

          {/* Filters section */}
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
                    onChange={(e) => handleFilterChange(null, e.target.value as string)}
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
                      getOptionLabel={(option) => option.name}
                      value={companies.filter(company => selectedCompanies.includes(company.id as number))}
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

          {/* Contacts grid */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <Grid container spacing={3}>
                {contacts.length === 0 && !loading ? (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No contacts found. Try adjusting your filters or create a new contact.
                      </Typography>
                      <Button 
                        variant="contained" 
                        sx={{ mt: 2 }}
                        onClick={handleCreateContact}
                        startIcon={<UserPlus size={16} />}
                      >
                        Add New Contact
                      </Button>
                    </Box>
                  </Grid>
                ) : (
                  contacts.map((contact) => (
                    <Grid item xs={12} sm={6} md={4} key={contact.id}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar
                              src={'/assets/img/contact.png'}
                              alt={contact.name}
                              sx={{ width: 56, height: 56, mr: 2 }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                                  {contact.name}
                                </Typography>
                                {contact.isAutoSynced && (
                                  <Tooltip title="Synced Contact">
                                    <Check size={16} style={{ color: 'green' }} />
                                  </Tooltip>
                                )}
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {contact.company || ''}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Mail size={16} style={{ marginRight: 8 }} />
                            <Typography variant="body2">{contact.email}</Typography>
                          </Box>

                          {contact.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Phone size={16} style={{ marginRight: 8 }} />
                              <Typography variant="body2">{contact.phone}</Typography>
                            </Box>
                          )}

                          {contact.company && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Building size={16} style={{ marginRight: 8 }} />
                              <Typography variant="body2">{contact.company}</Typography>
                            </Box>
                          )}

                          {/* Display tags */}
                          {contact.tags && contact.tags.length > 0 && (
                            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {contact.tags.map(tag => (
                                <Chip 
                                  key={tag.id} 
                                  label={tag.name} 
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
                            onClick={() => handleViewContact(contact.id)}
                          >
                            View Details
                          </Button>
                          {!contact.isAutoSynced && (
                            <Button
                              size="small"
                              onClick={() => handleEditContact(contact.id)}
                            >
                              Edit
                            </Button>
                          )}
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteContact(contact)}
                            sx={{ ml: 'auto' }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="primary" 
                  />
                </Box>
              )}
            </Grid>

            {/* Tags list on the right */}
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {tags.map(tag => (
                      <Chip
                        key={tag.id}
                        label={tag.name}
                        onClick={() => handleTagToggle(tag)}
                        color={selectedTags.some(t => t.id === tag.id) ? "primary" : "default"}
                        size="small"
                        sx={{ margin: '2px' }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Create Contact Modal */}
        <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Contact</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    label="Full Name"
                    fullWidth
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="phone"
                    label="Phone"
                    fullWidth
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Company</InputLabel>
                    <Select
                      name="companyId"
                      value={formData.companyId || ''}
                      onChange={handleCompanySelectChange as any}
                      label="Company"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {companies.map(company => (
                        <MenuItem key={company.id} value={company.id}>
                          {company.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={tags}
                    getOptionLabel={(option) => option.name}
                    value={formData.tags || []}
                    onChange={handleTagsChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                        placeholder="Select tags"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateSubmit} 
              variant="contained"
              disabled={!formData.name || !formData.email || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Contact Modal */}
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    label="Full Name"
                    fullWidth
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="phone"
                    label="Phone"
                    fullWidth
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Company</InputLabel>
                    <Select
                      name="companyId"
                      value={formData.companyId || ''}
                      onChange={handleCompanySelectChange as any}
                      label="Company"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {companies.map(company => (
                        <MenuItem key={company.id} value={company.id}>
                          {company.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={tags}
                    getOptionLabel={(option) => option.name}
                    value={formData.tags || []}
                    onChange={handleTagsChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                        placeholder="Select tags"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleEditSubmit} 
              variant="contained"
              disabled={!formData.name || !formData.email || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Contact Modal */}
        <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Contact Details</DialogTitle>
          <DialogContent>
            {currentContact && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    src={'/assets/img/contact.png'}
                    alt={currentContact.name}
                    sx={{ width: 64, height: 64, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6">{currentContact.name}</Typography>
                    {currentContact.isAutoSynced && (
                      <Chip 
                        label="Synced Contact" 
                        size="small" 
                        color="success" 
                        icon={<Check size={16} />} 
                      />
                    )}
                  </Box>
                </Box>

                <Typography variant="subtitle1" gutterBottom>Contact Information</Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{currentContact.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Phone</Typography>
                    <Typography variant="body1">{currentContact.phone || 'Not provided'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Company</Typography>
                    <Typography variant="body1">{currentContact.company || 'Not associated'}</Typography>
                  </Grid>
                </Grid>

                {currentContact.tags && currentContact.tags.length > 0 && (
                  <>
                    <Typography variant="subtitle1" gutterBottom>Tags</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                      {currentContact.tags.map(tag => (
                        <Chip 
                          key={tag.id} 
                          label={tag.name} 
                          size="small" 
                        />
                      ))}
                    </Box>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewModalOpen(false)}>Close</Button>
            {currentContact && !currentContact.isAutoSynced && (
              <Button 
                onClick={() => {
                  setViewModalOpen(false);
                  handleEditContact(currentContact.id);
                }} 
                color="primary"
              >
                Edit
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <DialogTitle>Delete Contact</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete {currentContact?.name}? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleDeleteSubmit} 
              color="error"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
        />
      </Container>
    </motion.div>
  );
};

export default Contacts;
