import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Autocomplete,
  Chip
} from '@mui/material';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
  CategoryDto,
  ServiceDto,
  CompanyDto
} from '../../services/api';

interface CompanyCreateEditProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (company: CreateCompanyDto | UpdateCompanyDto) => void;
  company?: CompanyDto;
  categories: CategoryDto[];
  services: ServiceDto[];
  loading: boolean;
}

const CompanyCreateEdit: React.FC<CompanyCreateEditProps> = ({
  open,
  onClose,
  onSubmit,
  company,
  categories,
  services,
  loading
}) => {
  const isEditMode = Boolean(company);
  
  const [formData, setFormData] = useState<CreateCompanyDto>({
    name: company?.name || '',
    description: company?.description || '',
    address: company?.address || '',
    phone: company?.phone || '',
    email: company?.email || '',
    website: company?.website || '',
    categoryId: company?.categoryId,
    serviceIds: company?.services?.map(service => service.id) || []
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
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
    setFormData({
      ...formData,
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
    setFormData({
      ...formData,
      serviceIds: e.target.value as number[]
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Company name is required';
    }
    
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (formData.website && !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(formData.website)) {
      errors.website = 'Invalid website URL';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    if (isEditMode && company) {
      onSubmit({
        ...formData as UpdateCompanyDto,
        id: company.id
      });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditMode ? 'Edit Company' : 'Create New Company'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Company Name"
              fullWidth
              required
              value={formData.name}
              onChange={handleInputChange}
              error={Boolean(formErrors.name)}
              helperText={formErrors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="address"
              label="Address"
              fullWidth
              value={formData.address}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="phone"
              label="Phone"
              fullWidth
              value={formData.phone}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleInputChange}
              error={Boolean(formErrors.email)}
              helperText={formErrors.email}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="website"
              label="Website"
              fullWidth
              value={formData.website}
              onChange={handleInputChange}
              error={Boolean(formErrors.website)}
              helperText={formErrors.website}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={Boolean(formErrors.categoryId)}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={formData.categoryId || ''}
                onChange={handleCategoryChange as any}
                label="Category"
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
              {formErrors.categoryId && (
                <FormHelperText>{formErrors.categoryId}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="services-label">Services</InputLabel>
              <Select
                labelId="services-label"
                multiple
                value={formData.serviceIds || []}
                onChange={handleServicesChange as any}
                label="Services"
                renderValue={(selected) => (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {(selected as number[]).map((value) => {
                      const service = services.find(s => s.id === value);
                      return (
                        <Chip 
                          key={value} 
                          label={service?.name || value} 
                          size="small" 
                        />
                      );
                    })}
                  </div>
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
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : isEditMode ? 'Save Changes' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyCreateEdit;
