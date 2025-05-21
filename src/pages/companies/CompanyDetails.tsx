import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Chip,
  Divider,
  Link
} from '@mui/material';
import { 
  Building,
  Globe,
  Phone,
  Mail,
  Tag
} from 'lucide-react';
import { format } from 'date-fns';
import { CompanyDto, CompanyStatus } from '../../services/api';

interface CompanyDetailsProps {
  open: boolean;
  onClose: () => void;
  company: CompanyDto | null;
  onEdit?: () => void;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({
  open,
  onClose,
  company,
  onEdit
}) => {
  if (!company) return null;

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{company.name}</Typography>
          <Chip 
            label={getStatusText(company.status)} 
            color={getStatusColor(company.status)} 
            size="small" 
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {company.description || 'No description provided.'}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Divider />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Contact Information</Typography>
            
            {company.address && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Building size={18} style={{ marginRight: 8 }} />
                <Typography variant="body2">{company.address}</Typography>
              </Box>
            )}
            
            {company.phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone size={18} style={{ marginRight: 8 }} />
                <Typography variant="body2">{company.phone}</Typography>
              </Box>
            )}
            
            {company.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Mail size={18} style={{ marginRight: 8 }} />
                <Typography variant="body2">{company.email}</Typography>
              </Box>
            )}
            
            {company.website && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Globe size={18} style={{ marginRight: 8 }} />
                <Link href={company.website} target="_blank" rel="noopener noreferrer">
                  <Typography variant="body2">{company.website}</Typography>
                </Link>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Company Details</Typography>
            
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Category</Typography>
              <Typography variant="body1">{company.category?.name || 'Not categorized'}</Typography>
            </Box>
            
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Created</Typography>
              <Typography variant="body1">
                {company.createdAt ? format(new Date(company.createdAt), 'PPP') : 'Unknown'}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Last Updated</Typography>
              <Typography variant="body1">
                {company.updatedAt ? format(new Date(company.updatedAt), 'PPP') : 'Unknown'}
              </Typography>
            </Box>
          </Grid>
          
          {company.services && company.services.length > 0 && (
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Tag size={18} style={{ marginRight: 8 }} />
                <Typography variant="subtitle1">Services</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {company.services.map(service => (
                  <Chip 
                    key={service.id} 
                    label={service.name} 
                    size="small" 
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {onEdit && (
          <Button onClick={onEdit} color="primary">
            Edit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CompanyDetails;
