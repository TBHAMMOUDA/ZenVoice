import React from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Avatar, 
  Divider, 
  Card, 
  CardContent,
  Button,
  Chip
} from '@mui/material';
import { Mail, User, Shield, Calendar, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const Profile = () => {
  const { user } = useAuth();
  
  // Mock additional user data (would come from API in a real app)
  const userDetails = {
    joinDate: '2023-05-15',
    lastActive: new Date().toISOString(),
    department: 'Sales & Marketing',
    position: 'Senior Account Manager',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    bio: 'Experienced account manager with a focus on building long-term client relationships and driving business growth through strategic partnerships.',
    skills: ['Account Management', 'Client Relations', 'Sales Strategy', 'Team Leadership', 'Contract Negotiation']
  };

  if (!user) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            User information not available
          </Typography>
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
          <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
            Profile
          </Typography>

          {/* Profile Header Card */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 2,
              background: 'linear-gradient(to right, #3f51b5, #2196f3)',
              color: 'white'
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  sx={{ width: 100, height: 100, border: '4px solid white' }}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="h4" gutterBottom>
                  {user.name}
                </Typography>
                <Typography variant="subtitle1">
                  {userDetails.position} • {userDetails.department}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Shield size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Access
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Button 
                  variant="outlined" 
                  startIcon={<Edit size={16} />}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Edit Profile
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <Grid container spacing={4}>
            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Mail size={20} style={{ marginRight: 8, marginTop: 4 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Email Address
                          </Typography>
                          <Typography variant="body1">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <User size={20} style={{ marginRight: 8, marginTop: 4 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Role
                          </Typography>
                          <Typography variant="body1">
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Calendar size={20} style={{ marginRight: 8, marginTop: 4 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Member Since
                          </Typography>
                          <Typography variant="body1">
                            {format(new Date(userDetails.joinDate), 'MMMM dd, yyyy')}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Phone
                        </Typography>
                        <Typography variant="body1">
                          {userDetails.phone}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Location
                        </Typography>
                        <Typography variant="body1">
                          {userDetails.location}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Bio and Skills */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Bio & Skills
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="body1" paragraph>
                    {userDetails.bio}
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {userDetails.skills.map((skill, index) => (
                      <Chip 
                        key={index} 
                        label={skill} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Activity Summary */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Activity Summary
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" color="primary">
                          24
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Invoices Created
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" color="primary">
                          18
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Orders Processed
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" color="primary">
                          42
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Contacts Added
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" color="primary">
                          7
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Custom Lists Created
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Last active: {format(new Date(userDetails.lastActive), 'MMMM dd, yyyy HH:mm')}
                    </Typography>
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

export default Profile;
