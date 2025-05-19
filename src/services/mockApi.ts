import { 
  mockUsers, 
  mockContacts, 
  mockInvoices, 
  mockOrders, 
  mockCustomLists 
} from '../data/mockData';

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generic error for failed requests
class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number = 400) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Mock HTTP server to simulate REST API calls
export const mockApi = {
  // Users endpoints
  users: {
    getAll: async () => {
      await delay(300);
      // Remove sensitive data like passwords
      return mockUsers.map(({ password, ...user }) => user);
    },
    
    getById: async (id: string) => {
      await delay(200);
      const user = mockUsers.find(user => user.id === id);
      if (!user) throw new ApiError('User not found', 404);
      
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    },
    
    login: async (email: string, password: string) => {
      await delay(500);
      const user = mockUsers.find(u => u.email === email && u.password === password);
      if (!user) throw new ApiError('Invalid credentials', 401);
      
      const { password: _, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        token: 'mock-jwt-token-' + Math.random().toString(36).substring(2)
      };
    }
  },
  
  // Contacts endpoints
  contacts: {
    getAll: async () => {
      await delay(300);
      return mockContacts;
    },
    
    getById: async (id: string) => {
      await delay(200);
      const contact = mockContacts.find(contact => contact.id === id);
      if (!contact) throw new ApiError('Contact not found', 404);
      return contact;
    },
    
    create: async (contactData: any) => {
      await delay(400);
      // Validation
      if (!contactData.firstName || !contactData.lastName || !contactData.email) {
        throw new ApiError('Missing required fields');
      }
      
      const newContact = {
        id: Date.now().toString(),
        ...contactData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // In a real implementation, this would add to the database
      // For mock purposes, we just return the new contact
      return newContact;
    },
    
    update: async (id: string, contactData: any) => {
      await delay(300);
      const contactIndex = mockContacts.findIndex(contact => contact.id === id);
      if (contactIndex === -1) throw new ApiError('Contact not found', 404);
      
      // In a real implementation, this would update the database
      // For mock purposes, we just return the updated contact
      return {
        ...mockContacts[contactIndex],
        ...contactData,
        updatedAt: new Date().toISOString()
      };
    },
    
    delete: async (id: string) => {
      await delay(300);
      const contactIndex = mockContacts.findIndex(contact => contact.id === id);
      if (contactIndex === -1) throw new ApiError('Contact not found', 404);
      
      // In a real implementation, this would delete from the database
      // For mock purposes, we just return success
      return { success: true };
    }
  },
  
  // Invoices endpoints
  invoices: {
    getAll: async () => {
      await delay(300);
      return mockInvoices;
    },
    
    getById: async (id: string) => {
      await delay(200);
      const invoice = mockInvoices.find(invoice => invoice.id === id);
      if (!invoice) throw new ApiError('Invoice not found', 404);
      return invoice;
    },
    
    create: async (invoiceData: any) => {
      await delay(400);
      // Validation
      if (!invoiceData.clientName || !invoiceData.amount || !invoiceData.dueDate) {
        throw new ApiError('Missing required fields');
      }
      
      const newInvoice = {
        id: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        ...invoiceData,
        issuedDate: invoiceData.issuedDate || new Date().toISOString().split('T')[0],
        status: invoiceData.status || 'received'
      };
      
      return newInvoice;
    },
    
    update: async (id: string, invoiceData: any) => {
      await delay(300);
      const invoiceIndex = mockInvoices.findIndex(invoice => invoice.id === id);
      if (invoiceIndex === -1) throw new ApiError('Invoice not found', 404);
      
      return {
        ...mockInvoices[invoiceIndex],
        ...invoiceData
      };
    },
    
    delete: async (id: string) => {
      await delay(300);
      const invoiceIndex = mockInvoices.findIndex(invoice => invoice.id === id);
      if (invoiceIndex === -1) throw new ApiError('Invoice not found', 404);
      
      return { success: true };
    }
  },
  
  // Orders endpoints
  orders: {
    getAll: async () => {
      await delay(300);
      return mockOrders;
    },
    
    getById: async (id: string) => {
      await delay(200);
      const order = mockOrders.find(order => order.id === id);
      if (!order) throw new ApiError('Order not found', 404);
      return order;
    },
    
    create: async (orderData: any) => {
      await delay(400);
      // Validation
      if (!orderData.customerName || !orderData.total || !orderData.items) {
        throw new ApiError('Missing required fields');
      }
      
      const newOrder = {
        id: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        ...orderData,
        orderDate: orderData.orderDate || new Date().toISOString().split('T')[0],
        status: orderData.status || 'pending'
      };
      
      return newOrder;
    },
    
    update: async (id: string, orderData: any) => {
      await delay(300);
      const orderIndex = mockOrders.findIndex(order => order.id === id);
      if (orderIndex === -1) throw new ApiError('Order not found', 404);
      
      return {
        ...mockOrders[orderIndex],
        ...orderData
      };
    },
    
    delete: async (id: string) => {
      await delay(300);
      const orderIndex = mockOrders.findIndex(order => order.id === id);
      if (orderIndex === -1) throw new ApiError('Order not found', 404);
      
      return { success: true };
    }
  },
  
  // Custom Lists endpoints
  customLists: {
    getAll: async () => {
      await delay(300);
      return mockCustomLists.map(list => {
        // Calculate contact count and companies for each list
        const listContacts = mockContacts.filter(contact => 
          list.contactIds.includes(contact.id)
        );
        
        const companies = [...new Set(listContacts.map(contact => contact.company))];
        
        return {
          ...list,
          contactCount: listContacts.length,
          companies
        };
      });
    },
    
    getById: async (id: string) => {
      await delay(200);
      const list = mockCustomLists.find(list => list.id === id);
      if (!list) throw new ApiError('Custom list not found', 404);
      
      // Get contacts in this list
      const listContacts = mockContacts.filter(contact => 
        list.contactIds.includes(contact.id)
      );
      
      // Get unique companies in this list
      const companies = [...new Set(listContacts.map(contact => contact.company))];
      
      return {
        ...list,
        contacts: listContacts,
        contactCount: listContacts.length,
        companies
      };
    },
    
    create: async (listData: any) => {
      await delay(400);
      // Validation
      if (!listData.name || !listData.contactIds || listData.contactIds.length === 0) {
        throw new ApiError('Missing required fields');
      }
      
      const newList = {
        id: Date.now().toString(),
        ...listData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        tags: listData.tags || []
      };
      
      return newList;
    },
    
    update: async (id: string, listData: any) => {
      await delay(300);
      const listIndex = mockCustomLists.findIndex(list => list.id === id);
      if (listIndex === -1) throw new ApiError('Custom list not found', 404);
      
      return {
        ...mockCustomLists[listIndex],
        ...listData,
        updatedAt: new Date().toISOString().split('T')[0]
      };
    },
    
    delete: async (id: string) => {
      await delay(300);
      const listIndex = mockCustomLists.findIndex(list => list.id === id);
      if (listIndex === -1) throw new ApiError('Custom list not found', 404);
      
      return { success: true };
    }
  }
};

export default mockApi;
