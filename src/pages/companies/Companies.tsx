import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Container, 
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { 
  companiesApi, 
  categoriesApi, 
  servicesApi, 
  CompanyDto, 
  CreateCompanyDto, 
  UpdateCompanyDto, 
  CompanyStatus, 
  CategoryDto, 
  NavigationDto,
} from '../../services/api';
import CompaniesList from './CompaniesList';
import CompanyCreateEdit from './CompanyCreateEdit';
import CompanyDetails from './CompanyDetails';
import CompanyStatusChange from './CompanyStatusChange';

const Companies = () => {
  // API data states
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [services, setServices] = useState<NavigationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<CompanyDto | null>(null);

  // Fetch data from API
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

  useEffect(() => {
    fetchData();
  }, []);

  // CRUD operations
  const handleCreateCompany = () => {
    setCreateDialogOpen(true);
  };

  const handleViewCompany = (company: CompanyDto) => {
    setCurrentCompany(company);
    setViewDialogOpen(true);
  };

  const handleEditCompany = (company: CompanyDto) => {
    setCurrentCompany(company);
    setEditDialogOpen(true);
  };

  const handleDeleteCompany = (company: CompanyDto) => {
    setCurrentCompany(company);
    setDeleteDialogOpen(true);
  };

  const handleChangeStatus = (company: CompanyDto) => {
    setCurrentCompany(company);
    setStatusDialogOpen(true);
  };

  const submitCreateCompany = async (formData: CreateCompanyDto) => {
    try {
      setLoading(true);
      const newCompany = await companiesApi.create(formData);
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

  const submitEditCompany = async (formData: UpdateCompanyDto) => {
    if (!currentCompany?.id) return;
    
    try {
      setLoading(true);
      const updatedCompany = await companiesApi.update(currentCompany.id, {
        ...formData,
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

  const submitStatusChange = async (newStatus: CompanyStatus) => {
    if (!currentCompany?.id) return;
    
    try {
      setLoading(true);
      const updatedCompany = await companiesApi.patchStatus(currentCompany.id, {
        id: currentCompany.id,
        status: newStatus
      });
      
      setCompanies(companies.map(company => 
        company.id === updatedCompany.id ? updatedCompany : company
      ));
      setStatusDialogOpen(false);
      setError(null);
    } catch (err) {
      console.error('Error updating company status:', err);
      setError('Failed to update company status. Please try again.');
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
        {/* Companies List Component */}
        <CompaniesList 
          companies={companies}
          categories={categories}
          loading={loading}
          error={error}
          onCreateCompany={handleCreateCompany}
          onViewDetailsCompany={handleViewCompany}
          onEditCompany={handleEditCompany}
          onDeleteCompany={handleDeleteCompany}
          onChangeStatus={handleChangeStatus}
          onRefresh={fetchData}
        />
        
        {/* Create Company Dialog */}
        <CompanyCreateEdit
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={submitCreateCompany}
          categories={categories}
          services={services}
          loading={loading}
        />
        
        {/* Edit Company Dialog */}
        <CompanyCreateEdit
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSubmit={submitEditCompany}
          company={currentCompany}
          categories={categories}
          services={services}
          loading={loading}
        />
        
        {/* View Company Details Dialog */}
        <CompanyDetails
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          company={currentCompany}
          onEdit={() => {
            setViewDialogOpen(false);
            setEditDialogOpen(true);
          }}
        />
        
        {/* Change Company Status Dialog */}
        <CompanyStatusChange
          open={statusDialogOpen}
          onClose={() => setStatusDialogOpen(false)}
          company={currentCompany}
          onSubmit={submitStatusChange}
          loading={loading}
        />
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
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
      </Container>
    </motion.div>
  );
};

export default Companies;
