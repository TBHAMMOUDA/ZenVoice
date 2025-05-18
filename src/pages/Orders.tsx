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
  Pagination
} from '@mui/material';
import { Plus, Search, Filter, ChevronDown, Download } from 'lucide-react';
import { format } from 'date-fns';
import mockApi from '../services/mockApi';

const ITEMS_PER_PAGE = 25;

const Orders = () => {
  const navigate = useNavigate();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  
  // API data states
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const ordersData = await mockApi.orders.getAll();
        setOrders(ordersData);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders data:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter orders based on all criteria
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search term filter (ID, customer)
      const matchesSearch = searchTerm === '' || 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      // Amount range filter
      const matchesMinAmount = minAmount === '' || order.total >= parseFloat(minAmount);
      const matchesMaxAmount = maxAmount === '' || order.total <= parseFloat(maxAmount);
      
      // Date range filter
      const orderDate = new Date(order.orderDate);
      const matchesStartDate = startDate === '' || new Date(startDate) <= orderDate;
      const matchesEndDate = endDate === '' || new Date(endDate) >= orderDate;
      
      return matchesSearch && matchesStatus && 
             matchesMinAmount && matchesMaxAmount && 
             matchesStartDate && matchesEndDate;
    });
  }, [orders, searchTerm, statusFilter, minAmount, maxAmount, startDate, endDate]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const handleMinAmountChange = (event) => {
    setMinAmount(event.target.value);
    setPage(1);
  };

  const handleMaxAmountChange = (event) => {
    setMaxAmount(event.target.value);
    setPage(1);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    setPage(1);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setMinAmount('');
    setMaxAmount('');
    setStartDate('');
    setEndDate('');
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
    console.log('Exporting orders...');
    handleMenuClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'default';
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
              Orders
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
              <MenuItem onClick={() => { navigate('/orders/create'); handleMenuClose(); }}>
                <Plus size={16} style={{ marginRight: 8 }} />
                Add New Order
              </MenuItem>
              <MenuItem onClick={handleExport}>
                <Download size={16} style={{ marginRight: 8 }} />
                Export Orders
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
                  placeholder="Search orders..."
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
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
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
                    <TextField
                      fullWidth
                      label="Min Amount"
                      type="number"
                      value={minAmount}
                      onChange={handleMinAmountChange}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Max Amount"
                      type="number"
                      value={maxAmount}
                      onChange={handleMaxAmountChange}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      InputLabelProps={{ shrink: true }}
                    />
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
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{format(new Date(order.orderDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{order.items.length} items</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No orders found matching the current filters
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
    </motion.div>
  );
};

export default Orders;
