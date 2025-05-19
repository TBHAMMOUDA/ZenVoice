import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Tooltip,
  InputAdornment,
  Menu,
  CircularProgress,
  Alert,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormHelperText
} from '@mui/material';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  Download, 
  Edit, 
  Trash2, 
  Building,
  Globe,
  Phone,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  companiesApi, 
  categoriesApi, 
  servicesApi, 
  CompanyDto, 
  CreateCompanyDto, 
  UpdateCompanyDto, 
  CompanyStatus, 
  CategoryDto, 
  ServiceDto 
} from '../services/api';

const ITEMS_PER_PAGE = 25;

const Companies = () => {
  const navigate = useNavigate();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  
  // API data states
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<CompanyDto | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Form state for create/edit
  const [companyForm, setCompanyForm] = useState<CreateCompanyDto>({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    categoryId: undefined,
    serviceIds: []
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [companiesData, categoriesData, servicesData] = await Promise.all([
          companiesApi.getAll(),
          categoriesApi.getAll(),
          servicesApi.getAll()
        ]);
        setCompanies(companiesData);
        setCategories(categoriesData);
        setServices(servicesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load companies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter companies based on all criteria
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      // Search term filter (name, email, phone)
      const matchesSearch = searchTerm === '' || 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.email && company.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company.phone && company.phone.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || company.status.toString() === statusFilter;
      
      // Category filter
      const matchesCategory = categoryFilter === 'all' || 
        (company.categoryId && company.categoryId.toString() === categoryFilter);
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [companies, searchTerm, statusFilter, categoryFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  const paginatedCompanies = filteredCompanies.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatusFilter(event.target.value as string);
    setPage(1);
  };

  const handleCategoryFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCategoryFilter(event.target.value as string);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setPage(1);
  };
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExport = () => {
    // Export functionality would go here
    console.log('Exporting companies...');
    handleMenuClose();
  };

  const getStatusColor = (status: CompanyStatus) => {
    switch (status) {
      case CompanyStatus.Active:
        return 'success';
      case CompanyStatus.Inactive:
        return 'warning';
      case CompanyStatus.Archived:
        return 'error';
      case CompanyStatus.Pending:
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: CompanyStatus) => {
    switch (status) {
      case CompanyStatus.Active:
        return 'Active';
      case CompanyStatus.Inactive:
        return 'Inactive';
      case CompanyStatus.Archived:
        return 'Archived';
      case CompanyStatus.Pending:
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  // Form handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyForm({
      ...companyForm,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setCompanyForm({
      ...companyForm,
      categoryId: e.target.value as number
    });
    
    if (formErrors.categoryId) {
      setFormErrors({
        ...formErrors,
        categoryId: ''
      });
    }
  };

  const handleServicesChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setCompanyForm({
      ...companyForm,
      serviceIds: e.target.value as number[]
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!companyForm.name.trim()) {
      errors.name = 'Company name is required';
    }
    
    if (companyForm.email && !/^\S+@\S+\.\S+$/.test(companyForm.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (companyForm.website && !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(companyForm.website)) {
      errors.website = 'Invalid website URL';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // CRUD operations
  const handleCreateCompany = () => {
    setCompanyForm({
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      categoryId: undefined,
      serviceIds: []
    });
    setFormErrors({});
    setCreateDialogOpen(true);
  };

  const handleEditCompany = (company: CompanyDto) => {
    setCurrentCompany(company);
    setCompanyForm({
      name: company.name,
      description: company.description || '',
      address: company.address || '',
      phone: company.phone || '',
      email: company.email || '',
      website: company.website || '',
      categoryId: company.categoryId,
      serviceIds: company.services?.map(service => service.id) || []
    });
    setFormErrors({});
    setEditDialogOpen(true);
  };

  const handleDeleteCompany = (company: CompanyDto) => {
    setCurrentCompany(company);
    setDeleteDialogOpen(true);
  };

  const submitCreateCompany = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const newCompany = await companiesApi.create(companyForm);
      setCompanies([...companies, newCompany]);
      setCreateDialogOpen(false);
      setError(null);
    } catch (err) {
      console.error('Error creating company:', err);
      setError('Failed to create company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitEditCompany = async () => {
    if (!validateForm() || !currentCompany?.id) return;
    
    try {
      setLoading(true);
      const updatedCompany = await companiesApi.update(currentCompany.id, {
        ...companyForm as UpdateCompanyDto,
        id: currentCompany.id
      });
      
      setCompanies(companies.map(company => 
        company.id === updatedCompany.id ? updatedCompany : company
      ));
      setEditDialogOpen(false);
      setError(null);
    } catch (err) {
      console.error('Error updating company:', err);
      setError('Failed to update company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteCompany = async () => {
    if (!currentCompany?.id) return;
    
    try {
      setLoading(true);
      await companiesApi.delete(currentCompany.id);
      setCompanies(companies.filter(company => company.id !== currentCompany.id));
      setDeleteDialogOpen(false);
      setError(null);
    } catch (err) {
      console.error('Error deleting company:', err);
      setError('Failed to delete company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && companies.length === 0) {
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
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1">
              Companies
            </Typography>
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
              <MenuItem onClick={() => { handleCreateCompany(); handleMenuClose(); }}>
                <Plus size={16} style={{ marginRight: 8 }} />
                Add New Company
              </MenuItem>
              <MenuItem onClick={handleExport}>
                <Download size={16} style={{ marginRight: 8 }} />
                Export Companies
              </MenuItem>
            </Menu>
          </Box>

          {/* Search and Filter Section */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <Search size={16} style={{ marginRight: 8, color: 'gray' }} />
                  }}
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.9rem' } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    label="Status"
                    onChange={handleStatusFilterChange}
                    sx={{ '& .MuiInputBase-root': { fontSize: '0.9rem' } }}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value={CompanyStatus.Active.toString()}>Active</MenuItem>
                    <MenuItem value={CompanyStatus.Inactive.toString()}>Inactive</MenuItem>
                    <MenuItem value={CompanyStatus.Archived.toString()}>Archived</MenuItem>
                    <MenuItem value={CompanyStatus.Pending.toString()}>Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  startIcon={<Filter size={16} />}
                  onClick={toggleFilters}
                  sx={{ height: '40px', fontSize: '0.85rem' }}
                >
                  {showFilters ? 'Hide Filters' : 'More Filters'}
                </Button>
              </Grid>
            </Grid>

            {/* Advanced Filters */}
            {showFilters && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="category-filter-label">Category</InputLabel>
                      <Select
                        labelId="category-filter-label"
                        value={categoryFilter}
                        label="Category"
                        onChange={handleCategoryFilterChange}
                      >
                        <MenuItem value="all">All Categories</MenuItem>
                        {categories.map(category => (
                          <MenuItem key={category.id} value={category.id?.toString()}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Services</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCompanies.length > 0 ? (
                  paginatedCompanies.map((company) => (
                    <TableRow key={company.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body1" fontWeight="medium">
                            {company.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{company.categoryName || 'Uncategorized'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          {company.phone && (
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                              <Phone size={14} style={{ marginRight: 4 }} />
                              {company.phone}
                            </Typography>
                          )}
                          {company.email && (
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Mail size={14} style={{ marginRight: 4 }} />
                              {company.email}
                            </Typography>
                          )}
                          {company.website && (
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Globe size={14} style={{ marginRight: 4 }} />
                              {company.website}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(company.status)}
                          color={getStatusColor(company.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {company.services && company.services.length > 0 ? (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {company.services.slice(0, 2).map(service => (
                              <Chip 
                                key={service.id} 
                                label={service.name} 
                                size="small" 
                                variant="outlined"
                              />
                            ))}
                            {company.services.length > 2 && (
                              <Chip 
                                label={`+${company.services.length - 2} more`} 
                                size="small" 
                                variant="outlined"
                              />
                            )}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No services
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditCompany(company)}
                            sx={{ mr: 1 }}
                          >
                            <Edit size={16} />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDeleteCompany(company)}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No companies found matching the current filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
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

      {/* Create Company Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Company</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Company Name"
                fullWidth
                value={companyForm.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={companyForm.description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={companyForm.email}
                onChange={handleInputChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="phone"
                label="Phone"
                fullWidth
                value={companyForm.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                value={companyForm.address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="website"
                label="Website"
                fullWidth
                value={companyForm.website}
                onChange={handleInputChange}
                error={!!formErrors.website}
                helperText={formErrors.website}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.categoryId}>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  value={companyForm.categoryId || ''}
                  label="Category"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.categoryId && <FormHelperText>{formErrors.categoryId}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="services-select-label">Services</InputLabel>
                <Select
                  labelId="services-select-label"
                  multiple
                  value={companyForm.serviceIds || []}
                  label="Services"
                  onChange={handleServicesChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as number[]).map((value) => {
                        const service = services.find(s => s.id === value);
                        return service ? (
                          <Chip key={value} label={service.name} size="small" />
                        ) : null;
                      })}
                    </Box>
                  )}
                >
                  {services.map(service => (
                    <MenuItem key={service.id} value={service.id}>
                      {service.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={submitCreateCompany} 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Company Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Company</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Company Name"
                fullWidth
                value={companyForm.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={companyForm.description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={companyForm.email}
                onChange={handleInputChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="phone"
                label="Phone"
                fullWidth
                value={companyForm.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                value={companyForm.address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="website"
                label="Website"
                fullWidth
                value={companyForm.website}
                onChange={handleInputChange}
                error={!!formErrors.website}
                helperText={formErrors.website}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.categoryId}>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  value={companyForm.categoryId || ''}
                  label="Category"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.categoryId && <FormHelperText>{formErrors.categoryId}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="services-select-label">Services</InputLabel>
                <Select
                  labelId="services-select-label"
                  multiple
                  value={companyForm.serviceIds || []}
                  label="Services"
                  onChange={handleServicesChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as number[]).map((value) => {
                        const service = services.find(s => s.id === value);
                        return service ? (
                          <Chip key={value} label={service.name} size="small" />
                        ) : null;
                      })}
                    </Box>
                  )}
                >
                  {services.map(service => (
                    <MenuItem key={service.id} value={service.id}>
                      {service.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={submitEditCompany} 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Company</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {currentCompany?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmDeleteCompany} 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default Companies;
