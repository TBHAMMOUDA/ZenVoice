import React from 'react';
import { useParams } from 'react-router-dom';

const InvoiceDetails = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Invoice Details</h1>
      <p className="text-gray-600">Viewing invoice #{id}</p>
    </div>
  );
};

export default InvoiceDetails;