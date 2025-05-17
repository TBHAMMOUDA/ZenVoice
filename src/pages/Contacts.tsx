import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Pagination,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import { Plus, Phone, Mail, Building, Search, Check, UserPlus } from 'lucide-react';
import { mockContacts } from '../data/mockData';

const ITEMS_PER_PAGE = 6;

const Contacts = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Filter and search contacts
  const filteredContacts = useMemo(() => {
    return mockContacts
      .filter(contact => {
        const matchesSearch = (
          contact.firstName.toLowerCase().includes(search.toLowerCase()) ||
          contact.lastName.toLowerCase().includes(search.toLowerCase()) ||
          contact.email.toLowerCase().includes(search.toLowerCase())
        );
        
        if (filter === 'synced') return matchesSearch && contact.synced;
        if (filter === 'manual') return matchesSearch && !contact.synced;
        return matchesSearch;
      });
  }, [search, filter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);
  const paginatedContacts = filteredContacts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleFilterChange = (event: React.MouseEvent<HTMLElement>, newFilter: string) => {
    if (newFilter !== null) {
      setFilter(newFilter);
      setPage(1);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
              Contacts
            </Typography>
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={() => navigate('/contacts/create')}
            >
              Add Contact
            </Button>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search contacts..."
                  value={search}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <Search size={20} style={{ marginRight: 8, color: 'gray' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ToggleButtonGroup
                  value={filter}
                  exclusive
                  onChange={handleFilterChange}
                  aria-label="contact filter"
                >
                  <ToggleButton value="all">
                    All Contacts
                  </ToggleButton>
                  <ToggleButton value="synced">
                    Synced
                  </ToggleButton>
                  <ToggleButton value="manual">
                    Manual
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={3}>
            {paginatedContacts.map((contact) => (
              <Grid item xs={12} sm={6} md={4} key={contact.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={contact.avatar}
                        alt={`${contact.firstName} ${contact.lastName}`}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6">
                            {contact.firstName} {contact.lastName}
                          </Typography>
                          {contact.synced && (
                            <Tooltip title="Synced Contact">
                              <Check size={16} style={{ color: 'green' }} />
                            </Tooltip>
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {contact.company}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Mail size={16} style={{ marginRight: 8 }} />
                      <Typography variant="body2">{contact.email}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone size={16} style={{ marginRight: 8 }} />
                      <Typography variant="body2">{contact.phone}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Building size={16} style={{ marginRight: 8 }} />
                      <Typography variant="body2">{contact.company}</Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(`/contacts/${contact.id}`)}
                    >
                      View Details
                    </Button>
                    {!contact.synced && (
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/contacts/${contact.id}/edit`)}
                      >
                        Edit
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

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

export default Contacts;