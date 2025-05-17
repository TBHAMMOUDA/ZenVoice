export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'taha.hammouda@gmail.com',
    password: '123456',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'password456',
    role: 'editor',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    password: 'password789',
    role: 'reader',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

export const mockContacts = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Brown',
    email: 'alice.brown@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Solutions Inc.',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
    synced: true,
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-03-10T14:20:00Z',
    notes: 'Key client for enterprise solutions',
    tags: ['enterprise', 'tech']
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Wilson',
    email: 'bob.wilson@example.com',
    phone: '+1 (555) 234-5678',
    company: 'Digital Dynamics LLC',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
    synced: false,
    createdAt: '2024-02-01T10:15:00Z',
    updatedAt: '2024-03-05T16:45:00Z',
    notes: 'Interested in mobile app development',
    tags: ['startup', 'mobile']
  },
  {
    id: '3',
    firstName: 'Carol',
    lastName: 'Martinez',
    email: 'carol.martinez@example.com',
    phone: '+1 (555) 345-6789',
    company: 'Innovative Systems Corp',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=300',
    synced: true,
    createdAt: '2024-01-20T09:45:00Z',
    updatedAt: '2024-03-08T11:30:00Z',
    notes: 'Regular consultant for AI projects',
    tags: ['ai', 'consulting']
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Chen',
    email: 'david.chen@example.com',
    phone: '+1 (555) 456-7890',
    company: 'Global Solutions Ltd',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300',
    synced: false,
    createdAt: '2024-02-10T11:20:00Z',
    updatedAt: '2024-03-12T13:15:00Z',
    notes: 'International client with multiple projects',
    tags: ['international', 'enterprise']
  },
  {
    id: '5',
    firstName: 'Emma',
    lastName: 'Taylor',
    email: 'emma.taylor@example.com',
    phone: '+1 (555) 567-8901',
    company: 'Creative Design Co',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300',
    synced: true,
    createdAt: '2024-01-25T13:40:00Z',
    updatedAt: '2024-03-15T09:20:00Z',
    notes: 'Design partner for UI/UX projects',
    tags: ['design', 'creative']
  },
  {
    id: '6',
    firstName: 'Frank',
    lastName: 'Anderson',
    email: 'frank.anderson@example.com',
    phone: '+1 (555) 678-9012',
    company: 'Security First Inc',
    avatar: 'https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=300',
    synced: false,
    createdAt: '2024-02-15T15:10:00Z',
    updatedAt: '2024-03-18T10:45:00Z',
    notes: 'Cybersecurity consultation client',
    tags: ['security', 'tech']
  }
];

export const mockInvoices = [
  {
    id: 'INV-2024-001',
    clientName: 'Tech Solutions Inc.',
    supplier: 'Acme Supplies',
    amount: 2500.00,
    status: 'posted',
    dueDate: '2024-03-15',
    issuedDate: '2024-02-15',
    description: 'Web Development Services - February 2024',
    orderNumber: 'ORD-2024-001',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'pdf'
  },
  {
    id: 'INV-2024-002',
    clientName: 'Digital Dynamics LLC',
    supplier: 'Global Tech Partners',
    amount: 1800.00,
    status: 'validated',
    dueDate: '2024-03-30',
    issuedDate: '2024-03-01',
    description: 'UI/UX Design Services - March 2024',
    orderNumber: 'ORD-2024-002',
    fileUrl: 'https://filesamples.com/samples/document/xml/sample_3.xml',
    fileType: 'xml'
  },
  {
    id: 'INV-2024-003',
    clientName: 'Innovative Systems Corp',
    supplier: 'Tech Innovations Inc',
    amount: 3200.00,
    status: 'to_be_posted',
    dueDate: '2024-02-28',
    issuedDate: '2024-01-28',
    description: 'Software Consulting - January 2024',
    orderNumber: null,
    fileUrl: null,
    fileType: null
  },
  {
    id: 'INV-2024-004',
    clientName: 'Creative Design Co',
    supplier: 'Design Solutions Ltd',
    amount: 950.00,
    status: 'received',
    dueDate: '2024-04-15',
    issuedDate: '2024-03-15',
    description: 'Logo Design and Branding - March 2024',
    orderNumber: null,
    fileUrl: 'https://example.com/invoices/INV-2024-004.jpg',
    fileType: 'image'
  },
  {
    id: 'INV-2024-005',
    clientName: 'Security First Inc',
    supplier: 'Secure Systems Co',
    amount: 4500.00,
    status: 'received',
    dueDate: '2024-04-20',
    issuedDate: '2024-03-20',
    description: 'Security Audit Services - March 2024',
    orderNumber: 'ORD-2024-003',
    fileUrl: null,
    fileType: null
  }
];

export const mockOrders = [
  {
    id: 'ORD-2024-001',
    customerName: 'Alice Brown',
    total: 1299.99,
    status: 'completed',
    orderDate: '2024-03-01',
    items: [
      { name: 'Premium Package', quantity: 1, price: 1299.99 }
    ]
  },
  {
    id: 'ORD-2024-002',
    customerName: 'Bob Wilson',
    total: 799.98,
    status: 'processing',
    orderDate: '2024-03-05',
    items: [
      { name: 'Standard Package', quantity: 2, price: 399.99 }
    ]
  },
  {
    id: 'ORD-2024-003',
    customerName: 'Carol Martinez',
    total: 599.99,
    status: 'pending',
    orderDate: '2024-03-10',
    items: [
      { name: 'Basic Package', quantity: 1, price: 599.99 }
    ]
  }
];
