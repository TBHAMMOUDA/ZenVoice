import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardHeader,
  Divider
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis
} from 'recharts';
import { mockInvoices, mockOrders } from '../data/mockData';
import { FileText, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  // Calculate invoice statistics
  const invoiceStats = useMemo(() => {
    const statusCounts = {
      received: 0,
      to_be_posted: 0,
      validated: 0,
      posted: 0
    };
    
    let totalAmount = 0;
    
    mockInvoices.forEach(invoice => {
      if (statusCounts.hasOwnProperty(invoice.status)) {
        statusCounts[invoice.status]++;
      }
      totalAmount += invoice.amount;
    });
    
    return {
      counts: statusCounts,
      total: mockInvoices.length,
      totalAmount: totalAmount.toFixed(2)
    };
  }, []);

  // Calculate order statistics
  const orderStats = useMemo(() => {
    const statusCounts = {
      pending: 0,
      processing: 0,
      completed: 0
    };
    
    let totalAmount = 0;
    
    mockOrders.forEach(order => {
      if (statusCounts.hasOwnProperty(order.status)) {
        statusCounts[order.status]++;
      }
      totalAmount += order.total;
    });
    
    return {
      counts: statusCounts,
      total: mockOrders.length,
      totalAmount: totalAmount.toFixed(2)
    };
  }, []);

  // Prepare data for invoice status chart
  const invoiceChartData = useMemo(() => {
    return [
      { name: 'Received', value: invoiceStats.counts.received, color: '#2196f3' },
      { name: 'To Be Posted', value: invoiceStats.counts.to_be_posted, color: '#ff9800' },
      { name: 'Validated', value: invoiceStats.counts.validated, color: '#4caf50' },
      { name: 'Posted', value: invoiceStats.counts.posted, color: '#3f51b5' }
    ];
  }, [invoiceStats]);

  // Prepare data for order status chart
  const orderChartData = useMemo(() => {
    return [
      { name: 'Pending', value: orderStats.counts.pending, color: '#ff9800' },
      { name: 'Processing', value: orderStats.counts.processing, color: '#2196f3' },
      { name: 'Completed', value: orderStats.counts.completed, color: '#4caf50' }
    ];
  }, [orderStats]);

  // Prepare data for monthly comparison chart
  const monthlyComparisonData = [
    { name: 'Jan', invoices: 4, orders: 3 },
    { name: 'Feb', invoices: 6, orders: 5 },
    { name: 'Mar', invoices: 5, orders: 3 },
    { name: 'Apr', invoices: 8, orders: 6 },
    { name: 'May', invoices: 7, orders: 4 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Invoice Stats */}
          <Grid item xs={12} md={6} lg={3}>
            <Card elevation={2}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    backgroundColor: 'primary.light', 
                    borderRadius: '50%', 
                    p: 1,
                    mr: 2
                  }}>
                    <FileText size={24} color="#1976d2" />
                  </Box>
                  <Typography variant="h6">Invoices</Typography>
                </Box>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {invoiceStats.total}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ 
                      width: 10, 
                      height: 10, 
                      borderRadius: '50%', 
                      backgroundColor: '#2196f3', 
                      display: 'inline-block',
                      mr: 0.5
                    }}></Box>
                    Received: {invoiceStats.counts.received}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ 
                      width: 10, 
                      height: 10, 
                      borderRadius: '50%', 
                      backgroundColor: '#ff9800', 
                      display: 'inline-block',
                      mr: 0.5
                    }}></Box>
                    To Be Posted: {invoiceStats.counts.to_be_posted}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ 
                      width: 10, 
                      height: 10, 
                      borderRadius: '50%', 
                      backgroundColor: '#4caf50', 
                      display: 'inline-block',
                      mr: 0.5
                    }}></Box>
                    Validated: {invoiceStats.counts.validated}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ 
                      width: 10, 
                      height: 10, 
                      borderRadius: '50%', 
                      backgroundColor: '#3f51b5', 
                      display: 'inline-block',
                      mr: 0.5
                    }}></Box>
                    Posted: {invoiceStats.counts.posted}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Stats */}
          <Grid item xs={12} md={6} lg={3}>
            <Card elevation={2}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    backgroundColor: 'secondary.light', 
                    borderRadius: '50%', 
                    p: 1,
                    mr: 2
                  }}>
                    <ShoppingCart size={24} color="#9c27b0" />
                  </Box>
                  <Typography variant="h6">Orders</Typography>
                </Box>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {orderStats.total}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ 
                      width: 10, 
                      height: 10, 
                      borderRadius: '50%', 
                      backgroundColor: '#ff9800', 
                      display: 'inline-block',
                      mr: 0.5
                    }}></Box>
                    Pending: {orderStats.counts.pending}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ 
                      width: 10, 
                      height: 10, 
                      borderRadius: '50%', 
                      backgroundColor: '#2196f3', 
                      display: 'inline-block',
                      mr: 0.5
                    }}></Box>
                    Processing: {orderStats.counts.processing}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ 
                      width: 10, 
                      height: 10, 
                      borderRadius: '50%', 
                      backgroundColor: '#4caf50', 
                      display: 'inline-block',
                      mr: 0.5
                    }}></Box>
                    Completed: {orderStats.counts.completed}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Invoice Amount */}
          <Grid item xs={12} md={6} lg={3}>
            <Card elevation={2}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    backgroundColor: 'success.light', 
                    borderRadius: '50%', 
                    p: 1,
                    mr: 2
                  }}>
                    <DollarSign size={24} color="#2e7d32" />
                  </Box>
                  <Typography variant="h6">Invoice Total</Typography>
                </Box>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  ${invoiceStats.totalAmount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total amount across all invoices
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Order Amount */}
          <Grid item xs={12} md={6} lg={3}>
            <Card elevation={2}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    backgroundColor: 'warning.light', 
                    borderRadius: '50%', 
                    p: 1,
                    mr: 2
                  }}>
                    <TrendingUp size={24} color="#ed6c02" />
                  </Box>
                  <Typography variant="h6">Order Total</Typography>
                </Box>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  ${orderStats.totalAmount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total amount across all orders
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          {/* Invoice Status Chart */}
          <Grid item xs={12} md={6} lg={4}>
            <Card elevation={2}>
              <CardHeader title="Invoice Status Distribution" />
              <Divider />
              <CardContent sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={invoiceChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {invoiceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} invoices`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Status Chart */}
          <Grid item xs={12} md={6} lg={4}>
            <Card elevation={2}>
              <CardHeader title="Order Status Distribution" />
              <Divider />
              <CardContent sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {orderChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Monthly Comparison Chart */}
          <Grid item xs={12} lg={4}>
            <Card elevation={2}>
              <CardHeader title="Monthly Comparison" />
              <Divider />
              <CardContent sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyComparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="invoices" name="Invoices" fill="#1976d2" />
                    <Bar dataKey="orders" name="Orders" fill="#9c27b0" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default Dashboard;