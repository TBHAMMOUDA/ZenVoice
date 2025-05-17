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
  InputAdornment
} from '@mui/material';
import { Plus, Search, Filter, Link as LinkIcon, Calendar, DollarSign } from 'lucide-react';
import { mockInvoices, mockOrders } from '../data/mockData';
import { format } from 'date-fns';

const getStatusColor = (status) => {
  switch (status) {
    case 'received':
      return 'info';
    case 'to_be_posted':
      return 'warning';
    case 'validated':
      return 'success';
    case 'posted':
      return 'primary';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'received':
      return 'Received';
    case 'to_be_posted':
      return 'To Be Posted';
    case 'validated':
      return 'Validated';
    case 'posted':
      return 'Posted';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

const Invoices = () => {
  const navigate = useNavigate();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique suppliers for filter dropdown
  const suppliers = useMemo(() => {
    return [...new Set(mockInvoices.map(invoice => invoice.supplier))].filter(Boolean);
  }, []);

  // Filter invoices based on all criteria
  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter(invoice => {
      // Search term filter (ID, client, supplier, description)
      const matchesSearch = searchTerm === '' || 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.supplier && invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (invoice.description && invoice.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      
      // Supplier filter
      const matchesSupplier = supplierFilter === '' || invoice.supplier === supplierFilter;
      
      // Amount range filter
      const matchesMinAmount = minAmount === '' || invoice.amount >= parseFloat(minAmount);
      const matchesMaxAmount = maxAmount === '' || invoice.amount <= parseFloat(maxAmount);
      
      // Date range filter (issued date)
      const invoiceDate = new Date(invoice.issuedDate);
      const matchesStartDate = startDate === '' || new Date(startDate) <= invoiceDate;
      const matchesEndDate = endDate === '' || new Date(endDate) >= invoiceDate;
      
      return matchesSearch && matchesStatus && matchesSupplier && 
             matchesMinAmount && matchesMaxAmount && 
             matchesStartDate && matchesEndDate;
    });
  }, [searchTerm, statusFilter, supplierFilter, minAmount, maxAmount, startDate, endDate]);

  // Check if invoice has a linked order
  const hasLinkedOrder = (orderNumber) => {
    return orderNumber && mockOrders.some(order => order.id === orderNumber);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleSupplierFilterChange = (event) => {
    setSupplierFilter(event.target.value);
  };

  const handleMinAmountChange = (event) => {
    setMinAmount(event.target.value);
  };

  const handleMaxAmountChange = (event) => {
    setMaxAmount(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSupplierFilter('');
    setMinAmount('');
    setMaxAmount('');
    setStartDate('');
    setEndDate('');
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
              Invoices
            </Typography>
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={() => navigate('/invoices/create')}
            >
              Create Invoice
            </Button>
          </Box>

          {/* Search and Filter Section */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <Search size={20} style={{ marginRight: 8, color: 'gray' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    label="Status"
                    onChange={handleStatusFilterChange}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="received">Received</MenuItem>
                    <MenuItem value="to_be_posted">To Be Posted</MenuItem>
                    <MenuItem value="validated">Validated</MenuItem>
                    <MenuItem value="posted">Posted</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Filter size={20} />}
                  onClick={toggleFilters}
                >
                  {showFilters ? 'Hide Filters' : 'More Filters'}
                </Button>
              </Grid>
            </Grid>

            {/* Advanced Filters */}
            {showFilters && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel id="supplier-filter-label">Supplier</InputLabel>
                      <Select
                        labelId="supplier-filter-label"
                        value={supplierFilter}
                        label="Supplier"
                        onChange={handleSupplierFilterChange}
                      >
                        <MenuItem value="">All Suppliers</MenuItem>
                        {suppliers.map((supplier) => (
                          <MenuItem key={supplier} value={supplier}>
                            {supplier}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
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
                  <Grid item xs={12} md={4}>
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
                  <TableCell>Invoice ID</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Issued Date</TableCell>
                  <TableCell>Order</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} hover>
                      <TableCell>{invoice.id}</TableCell>
                      <TableCell>{invoice.clientName}</TableCell>
                      <TableCell>{invoice.supplier || '-'}</TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(invoice.status)}
                          color={getStatusColor(invoice.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{format(new Date(invoice.issuedDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        {invoice.orderNumber ? (
                          <Tooltip title={`View Order ${invoice.orderNumber}`}>
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => navigate(`/orders/${invoice.orderNumber}`)}
                            >
                              <LinkIcon size={16} />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => navigate(`/invoices/${invoice.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No invoices found matching the current filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </motion.div>
  );
};

export default Invoices;
