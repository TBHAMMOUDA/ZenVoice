import React, { useState, useMemo } from 'react';
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
  Menu,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  Download, 
  Edit, 
  Trash2, 
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  CompanyDto, 
  CompanyStatus, 
  CategoryDto
} from '../../services/api';
import CompanyCreateEdit from './CompanyCreateEdit';
import CompanyDetails from './CompanyDetails';
import CompanyStatusChange from './CompanyStatusChange';

const ITEMS_PER_PAGE = 25;

interface CompaniesListProps {
  companies: CompanyDto[];
  categories: CategoryDto[];
  loading: boolean;
  error: string | null;
  onCreateCompany: () => void;
  onEditCompany: (company: CompanyDto) => void;
  onDeleteCompany: (company: CompanyDto) => void;
  onChangeStatus: (company: CompanyDto) => void;
  onRefresh: () => void;
}

const CompaniesList: React.FC<CompaniesListProps> = ({
  companies,
  categories,
  loading,
  error,
  onCreateCompany,
  onEditCompany,
  onDeleteCompany,
  onChangeStatus,
  onRefresh
}) => {
  const navigate = useNavigate();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [page, setPage] = useState(1);
  
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
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title="Refresh">
                <IconButton onClick={onRefresh} color="primary">
                  <RefreshCw size={20} />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                endIcon={<ChevronDown size={16} />}
                onClick={handleMenuOpen}
              >
                Actions
              </Button>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => { onCreateCompany(); handleMenuClose(); }}>
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
                    <FormControl fullWidth size="small">
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
                      <Button 
                        onClick={clearFilters}
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

          {/* Companies Table */}
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table sx={{ minWidth: 650 }} aria-label="companies table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Updated</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCompanies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          No companies found. Try adjusting your filters or create a new company.
                        </Typography>
                        <Button 
                          variant="contained" 
                          sx={{ mt: 2 }}
                          onClick={onCreateCompany}
                          startIcon={<Plus size={16} />}
                        >
                          Add New Company
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell component="th" scope="row">
                        {company.name}
                      </TableCell>
                      <TableCell>{company.categoryName || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusText(company.status)} 
                          color={getStatusColor(company.status)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        {company.createdAt ? format(new Date(company.createdAt), 'MMM d, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {company.updatedAt ? format(new Date(company.updatedAt), 'MMM d, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Change Status">
                          <IconButton 
                            size="small" 
                            onClick={() => onChangeStatus(company)}
                          >
                            <RefreshCw size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small" 
                            onClick={() => onEditCompany(company)}
                          >
                            <Edit size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => onDeleteCompany(company)}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
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
              />
            </Box>
          )}
        </Box>
      </Container>
    </motion.div>
  );
};

export default CompaniesList;
