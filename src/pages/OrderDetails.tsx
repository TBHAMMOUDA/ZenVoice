import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography, Container } from '@mui/material';

function OrderDetails() {
  const { id } = useParams();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg">
        <Box py={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Order Details
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Viewing details for order {id}
          </Typography>
        </Box>
      </Container>
    </motion.div>
  );
}

export default OrderDetails;