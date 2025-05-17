import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const ContactDetails = () => {
  const { id } = useParams();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
      <h1 className="text-2xl font-bold mb-6">Contact Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Viewing contact with ID: {id}</p>
      </div>
    </motion.div>
  );
};

export default ContactDetails;