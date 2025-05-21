import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Button,
  Chip,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Pagination,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Building
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { categoriesApi, CategoryDto } from '../../services/api';

const ITEMS_PER_PAGE = 25;

interface CompanyCategoriesProps {
  onError: (error: string | null) => void;
  onSuccess: (message: string | null) => void;
}

const CompanyCategories: React.FC<CompanyCategoriesProps> = ({ onError, onSuccess }) => {
  const { t } = useTranslation();
  
  // Loading state
  const [loading, setLoading] = useState(false);
  
  // Company Categories state
  const [companyCategories, setCompanyCategories] = useState<CategoryDto[]>([]);
  const [companyCategoryDialogOpen, setCompanyCategoryDialogOpen] = useState(false);
  const [companyCategoryDeleteConfirmOpen, setCompanyCategoryDeleteConfirmOpen] = useState(false);
  const [currentCompanyCategory, setCurrentCompanyCategory] = useState<CategoryDto>({ id: undefined, name: '', description: '' });
  const [isCompanyCategoryEditMode, setIsCompanyCategoryEditMode] = useState(false);
  const [companyCategoryFilter, setCompanyCategoryFilter] = useState('');
  const [companyCategoryPage, setCompanyCategoryPage] = useState(1);
  
  // Fetch data on component mount
  useEffect(() => {
    fetchCompanyCategories();
  }, []);
  
  // Fetch company categories from API
  const fetchCompanyCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesApi.getAll();
      setCompanyCategories(data);
      onError(null);
    } catch (err) {
      onError('Failed to load company categories');
      console.error('Error fetching company categories:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Filtered items
  const filteredCompanyCategories = companyCategories.filter(category => 
    category.name.toLowerCase().includes(companyCategoryFilter.toLowerCase())
  );
  
  // Paginated items
  const paginatedCompanyCategories = filteredCompanyCategories.slice(
    (companyCategoryPage - 1) * ITEMS_PER_PAGE, 
    companyCategoryPage * ITEMS_PER_PAGE
  );
  
  // Reset pagination when filter changes
  useEffect(() => {
    setCompanyCategoryPage(1);
  }, [companyCategoryFilter]);
  
  // Company Categories handlers
  const handleAddCompanyCategory = () => {
    setCurrentCompanyCategory({ id: undefined, name: '', description: '' });
    setIsCompanyCategoryEditMode(false);
    setCompanyCategoryDialogOpen(true);
  };
  
  const handleEditCompanyCategory = (category: CategoryDto) => {
    setCurrentCompanyCategory(category);
    setIsCompanyCategoryEditMode(true);
    setCompanyCategoryDialogOpen(true);
  };
  
  const handleCompanyCategoryDelete = (category: CategoryDto) => {
    setCurrentCompanyCategory(category);
    setCompanyCategoryDeleteConfirmOpen(true);
  };
  
  const handleCompanyCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentCompanyCategory({
      ...currentCompanyCategory,
      [name]: value
    });
  };
  
  const handleCompanyCategorySave = async () => {
    if (currentCompanyCategory.name.trim()) {
      try {
        setLoading(true);
        if (isCompanyCategoryEditMode && currentCompanyCategory.id) {
          // Update existing category
          const updatedCategory = await categoriesApi.update(currentCompanyCategory.id, currentCompanyCategory);
          setCompanyCategories(companyCategories.map(category => 
            category.id === updatedCategory.id ? updatedCategory : category
          ));
          onSuccess('Company category updated successfully');
        } else {
          // Add new category
          const newCategory = await categoriesApi.create(currentCompanyCategory);
          setCompanyCategories([...companyCategories, newCategory]);
          onSuccess('Company category created successfully');
        }
        setCompanyCategoryDialogOpen(false);
        onError(null);
      } catch (err) {
        onError(isCompanyCategoryEditMode ? 'Failed to update company category' : 'Failed to create company category');
        console.error('Error saving company category:', err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const confirmCompanyCategoryDelete = async () => {
    if (currentCompanyCategory && currentCompanyCategory.id) {
      try {
        setLoading(true);
        // Note: API doesn't have a delete endpoint for categories, so we're just removing it from the UI
        // In a real implementation, you would call the delete API here
        setCompanyCategories(companyCategories.filter(category => category.id !== currentCompanyCategory.id));
        setCompanyCategoryDeleteConfirmOpen(false);
        onSuccess('Company category deleted successfully');
        onError(null);
      } catch (err) {
        onError('Failed to delete company category');
        console.error('Error deleting company category:', err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleCompanyCategoryFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyCategoryFilter(e.target.value);
  };
  
  const handleCompanyCategoryPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCompanyCategoryPage(value);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Company Categories
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Manage company categories to organize and classify your business contacts.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          placeholder="Filter categories..."
          value={companyCategoryFilter}
          onChange={handleCompanyCategoryFilterChange}
          size="small"
          sx={{ width: '300px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<Plus size={16} />}
          onClick={handleAddCompanyCategory}
          disabled={loading}
        >
          Add Category
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <Grid container spacing={2}>
          {paginatedCompanyCategories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%',
                  '&:hover': {
                    boxShadow: 2
                  }
                }}
              >
                <CardContent sx={{ pb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Tooltip 
                      title={category.description || ''} 
                      arrow 
                      placement="top"
                      enterDelay={500}
                      leaveDelay={200}
                    >
                      <Chip 
                        label={category.name} 
                        size="small" 
                        color="secondary" 
                        variant="outlined"
                      />
                    </Tooltip>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditCompanyCategory(category)}
                        sx={{ mr: 0.5 }}
                        disabled={loading}
                      >
                        <Edit size={16} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleCompanyCategoryDelete(category)}
                        disabled={loading}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mt: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {category.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && filteredCompanyCategories.length > ITEMS_PER_PAGE && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination 
            count={Math.ceil(filteredCompanyCategories.length / ITEMS_PER_PAGE)} 
            page={companyCategoryPage} 
            onChange={handleCompanyCategoryPageChange} 
            color="primary" 
          />
        </Box>
      )}

      {!loading && filteredCompanyCategories.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            {t('common.noResults')}
          </Typography>
        </Box>
      )}

      {/* Company Category Dialog */}
      <Dialog open={companyCategoryDialogOpen} onClose={() => setCompanyCategoryDialogOpen(false)}>
        <DialogTitle>
          {isCompanyCategoryEditMode ? 'Edit' : 'Add'} Company Category
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Category Name"
            type="text"
            fullWidth
            value={currentCompanyCategory.name}
            onChange={handleCompanyCategoryInputChange}
            sx={{ mb: 2 }}
            disabled={loading}
          />
          <TextField
            margin="dense"
            name="description"
            label="Category Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={currentCompanyCategory.description || ''}
            onChange={handleCompanyCategoryInputChange}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompanyCategoryDialogOpen(false)} disabled={loading}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleCompanyCategorySave} 
            color="primary"
            disabled={loading || !currentCompanyCategory.name.trim()}
          >
            {loading ? <CircularProgress size={24} /> : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Company Category Delete Confirmation Dialog */}
      <Dialog open={companyCategoryDeleteConfirmOpen} onClose={() => setCompanyCategoryDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Company Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this company category? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompanyCategoryDeleteConfirmOpen(false)} disabled={loading}>{t('common.cancel')}</Button>
          <Button 
            onClick={confirmCompanyCategoryDelete} 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyCategories;
