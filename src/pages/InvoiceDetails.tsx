import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Chip, 
  Button, 
  Divider,
  Card,
  CardContent,
  Link,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Link as LinkIcon, 
  Calendar, 
  DollarSign,
  FileCode,
  Image,
  File
} from 'lucide-react';
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

const getFileIcon = (fileType) => {
  switch (fileType) {
    case 'pdf':
      return <FileText size={24} />;
    case 'xml':
      return <FileCode size={24} />;
    case 'image':
      return <Image size={24} />;
    default:
      return <File size={24} />;
  }
};

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [linkedOrder, setLinkedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState('');
  const [xmlContent, setXmlContent] = useState('');

  useEffect(() => {
    // Find invoice by ID
    const foundInvoice = mockInvoices.find(inv => inv.id === id);
    
    if (foundInvoice) {
      setInvoice(foundInvoice);
      
      // Find linked order if exists
      if (foundInvoice.orderNumber) {
        const order = mockOrders.find(ord => ord.id === foundInvoice.orderNumber);
        setLinkedOrder(order);
      }
      
      // Load file preview if available
      if (foundInvoice.fileUrl && foundInvoice.fileType) {
        if (foundInvoice.fileType === 'pdf') {
          setPdfPreviewUrl(foundInvoice.fileUrl);
        } else if (foundInvoice.fileType === 'xml') {
          // Fetch XML content for preview
          fetchXmlContent(foundInvoice.fileUrl);
        }
      }
    }
    
    setLoading(false);
  }, [id]);

  const fetchXmlContent = async (url) => {
    try {
      const response = await fetch(url);
      const text = await response.text();
      setXmlContent(text);
    } catch (error) {
      console.error('Error fetching XML content:', error);
      setXmlContent('Error loading XML content');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography>Loading invoice details...</Typography>
        </Box>
      </Container>
    );
  }

  if (!invoice) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            Invoice not found
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowLeft size={16} />}
            onClick={() => navigate('/invoices')}
            sx={{ mt: 2 }}
          >
            Back to Invoices
          </Button>
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
          {/* Header with back button */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Button
              startIcon={<ArrowLeft size={16} />}
              onClick={() => navigate('/invoices')}
              sx={{ mr: 2 }}
            >
              Back to Invoices
            </Button>
          </Box>

          {/* Invoice header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
            <Box>
              <Typography variant="h4" component="h1">
                Invoice {invoice.id}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {invoice.description}
              </Typography>
            </Box>
            <Chip
              label={getStatusLabel(invoice.status)}
              color={getStatusColor(invoice.status)}
              sx={{ fontSize: '1rem', height: 32, px: 1 }}
            />
          </Box>

          {/* Invoice details */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Invoice Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Client
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {invoice.clientName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Supplier
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {invoice.supplier || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Amount
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      ${invoice.amount.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={getStatusLabel(invoice.status)}
                      color={getStatusColor(invoice.status)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Issued Date
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {format(new Date(invoice.issuedDate), 'MMMM dd, yyyy')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Due Date
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {format(new Date(invoice.dueDate), 'MMMM dd, yyyy')}
                    </Typography>
                  </Grid>
                  {invoice.orderNumber && (
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <LinkIcon size={16} style={{ marginRight: 8, color: 'primary.main' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                          Linked Order:
                        </Typography>
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => navigate(`/orders/${invoice.orderNumber}`)}
                        >
                          {invoice.orderNumber}
                        </Button>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Paper>

              {/* File Preview Section */}
              {invoice.fileUrl && (
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getFileIcon(invoice.fileType)}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        Invoice Document
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<Download size={16} />}
                      component="a"
                      href={invoice.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      Download
                    </Button>
                  </Box>

                  {/* PDF Preview */}
                  {invoice.fileType === 'pdf' && pdfPreviewUrl && (
                    <Box sx={{ mt: 2, height: '500px', border: '1px solid #e0e0e0' }}>
                      <iframe
                        src={`${pdfPreviewUrl}#toolbar=0`}
                        width="100%"
                        height="100%"
                        title="PDF Preview"
                        style={{ border: 'none' }}
                      />
                    </Box>
                  )}

                  {/* XML Preview */}
                  {invoice.fileType === 'xml' && (
                    <Box 
                      sx={{ 
                        mt: 2, 
                        p: 2, 
                        maxHeight: '500px', 
                        overflowY: 'auto',
                        bgcolor: '#f5f5f5',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        borderRadius: 1,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all'
                      }}
                    >
                      {xmlContent || 'Loading XML content...'}
                    </Box>
                  )}

                  {/* Image Preview */}
                  {invoice.fileType === 'image' && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <img 
                        src={invoice.fileUrl} 
                        alt="Invoice" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '500px',
                          border: '1px solid #e0e0e0' 
                        }} 
                      />
                    </Box>
                  )}

                  {/* Other file types */}
                  {invoice.fileType && !['pdf', 'xml', 'image'].includes(invoice.fileType) && (
                    <Box 
                      sx={{ 
                        mt: 2, 
                        p: 4, 
                        border: '1px dashed #ccc',
                        borderRadius: 1,
                        textAlign: 'center'
                      }}
                    >
                      <File size={48} style={{ color: '#757575', marginBottom: 16 }} />
                      <Typography variant="body1" gutterBottom>
                        Preview not available for this file type
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Please download the file to view its contents
                      </Typography>
                    </Box>
                  )}
                </Paper>
              )}

              {/* No file placeholder */}
              {!invoice.fileUrl && (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Box sx={{ py: 4 }}>
                    <File size={48} style={{ color: '#757575', marginBottom: 16 }} />
                    <Typography variant="h6" gutterBottom>
                      No Invoice Document Available
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This invoice does not have an attached document
                    </Typography>
                  </Box>
                </Paper>
              )}
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              {/* Linked Order Card */}
              {linkedOrder && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Linked Order
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Order ID
                        </Typography>
                        <Typography variant="body1">
                          {linkedOrder.id}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Customer
                        </Typography>
                        <Typography variant="body1">
                          {linkedOrder.customerName}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Total
                        </Typography>
                        <Typography variant="body1">
                          ${linkedOrder.total.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Status
                        </Typography>
                        <Chip 
                          label={linkedOrder.status.charAt(0).toUpperCase() + linkedOrder.status.slice(1)} 
                          size="small"
                          color="primary"
                        />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Order Date
                        </Typography>
                        <Typography variant="body1">
                          {format(new Date(linkedOrder.orderDate), 'MMMM dd, yyyy')}
                        </Typography>
                      </Box>
                    </Stack>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 2 }}
                      onClick={() => navigate(`/orders/${linkedOrder.id}`)}
                    >
                      View Order Details
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Status Timeline Card */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Invoice Status
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ position: 'relative' }}>
                    {/* Timeline line */}
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        left: '15px', 
                        top: '8px', 
                        bottom: '8px', 
                        width: '2px', 
                        bgcolor: 'divider' 
                      }} 
                    />
                    
                    {/* Status steps */}
                    {['received', 'to_be_posted', 'validated', 'posted'].map((status, index) => {
                      const isActive = ['received', 'to_be_posted', 'validated', 'posted'].indexOf(invoice.status) >= index;
                      return (
                        <Box 
                          key={status} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            mb: index < 3 ? 3 : 0,
                            position: 'relative',
                            zIndex: 1
                          }}
                        >
                          <Box 
                            sx={{ 
                              width: 10, 
                              height: 10, 
                              borderRadius: '50%', 
                              bgcolor: isActive ? getStatusColor(status) + '.main' : 'divider',
                              border: '2px solid white',
                              mr: 2,
                              mt: 0.5
                            }} 
                          />
                          <Box>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: isActive ? 'bold' : 'normal',
                                color: isActive ? 'text.primary' : 'text.secondary'
                              }}
                            >
                              {getStatusLabel(status)}
                            </Typography>
                            {isActive && status === invoice.status && (
                              <Typography variant="caption" color="text.secondary">
                                Current Status
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </motion.div>
  );
};

export default InvoiceDetails;
