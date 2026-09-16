// Backend integration point: replace these with API calls to your database

export const SALESPEOPLE = [
  'Karenzi Remmy',
  'Alex Mushumba',
  'Isimbi Patience',
  'Mastiko Frank',
  'Muyenzi Dan',
];

export const CUSTOMER_CATEGORIES = [
  'Hotels',
  'Coffee Shops',
  'Wholesalers',
  'Supermarkets',
  'Shops',
  'Stores',
  'Galleries',
  'Offices',
];

export const VISIT_OUTCOMES = ['Order Placed', 'No Order / Visit Only', 'Follow-up Required'];

export const PAYMENT_STATUSES = ['Paid', 'Credit', 'Pending'];

export const CUSTOMER_TYPES = ['New Customer', 'Existing Customer'];

export const PIPELINE_STAGES = [
  'Prospecting',
  'Contacted',
  'Proposal',
  'Closing',
  'Won',
  'Lost',
];

export const PRODUCT_CATEGORIES = [
  '250G Roasted Coffee',
  '500G MG',
  '1KG Roasted Coffee',
  'Instant Coffee Sachets',
  'Green Coffee Beans',
  'Coffee Pods 10-pack',
];

export interface VisitLog {
  id: string;
  timestamp: string;
  salesperson: string;
  dateOfVisit: string;
  customerName: string;
  area: string;
  customerCategory: string;
  visitOutcome: string;
  productCategory: string;
  quantity: number;
  unitPrice: number;
  salesValue: number;
  paymentStatus: string;
  customerType: string;
  nextFollowUpDate: string;
  remarks: string;
}

export const visitLogs: VisitLog[] = [
  {
    id: 'visit-001',
    timestamp: '2026-09-04T08:15:00',
    salesperson: 'Karenzi Remmy',
    dateOfVisit: '2026-09-04',
    customerName: 'Nakumatt Kigali City Mall',
    area: 'Kigali Centre',
    customerCategory: 'Supermarkets',
    visitOutcome: 'Order Placed',
    productCategory: '500G MG',
    quantity: 48,
    unitPrice: 4800,
    salesValue: 230400,
    paymentStatus: 'Paid',
    customerType: 'Existing Customer',
    nextFollowUpDate: '2026-09-18',
    remarks: 'Increased order by 20% — new shelf placement secured',
  },
  {
    id: 'visit-002',
    timestamp: '2026-09-04T09:40:00',
    salesperson: 'Mastiko Frank',
    dateOfVisit: '2026-09-04',
    customerName: 'Hotel des Mille Collines',
    area: 'Kigali Centre',
    customerCategory: 'Hotels',
    visitOutcome: 'Order Placed',
    productCategory: '250G Roasted Coffee',
    quantity: 120,
    unitPrice: 2600,
    salesValue: 312000,
    paymentStatus: 'Credit',
    customerType: 'Existing Customer',
    nextFollowUpDate: '2026-09-15',
    remarks: 'Monthly standing order confirmed',
  },
  {
    id: 'visit-003',
    timestamp: '2026-09-03T11:20:00',
    salesperson: 'Isimbi Patience',
    dateOfVisit: '2026-09-03',
    customerName: 'Simba Supermarket Remera',
    area: 'Remera',
    customerCategory: 'Supermarkets',
    visitOutcome: 'No Order / Visit Only',
    productCategory: '1KG Roasted Coffee',
    quantity: 0,
    unitPrice: 9200,
    salesValue: 0,
    paymentStatus: 'Pending',
    customerType: 'Existing Customer',
    nextFollowUpDate: '2026-09-08',
    remarks: 'Manager on leave — follow up next week',
  },
  {
    id: 'visit-004',
    timestamp: '2026-09-03T14:05:00',
    salesperson: 'Alex Mushumba',
    dateOfVisit: '2026-09-03',
    customerName: 'Bourbon Coffee Kimihurura',
    area: 'Kimihurura',
    customerCategory: 'Coffee Shops',
    visitOutcome: 'Order Placed',
    productCategory: 'Coffee Pods 10-pack',
    quantity: 60,
    unitPrice: 5500,
    salesValue: 330000,
    paymentStatus: 'Paid',
    customerType: 'Existing Customer',
    nextFollowUpDate: '2026-09-20',
    remarks: 'Wants exclusive pod supply deal — escalate to manager',
  },
  {
    id: 'visit-005',
    timestamp: '2026-09-03T15:30:00',
    salesperson: 'Muyenzi Dan',
    dateOfVisit: '2026-09-03',
    customerName: 'Kigali Wholesale Hub',
    area: 'Nyabugogo',
    customerCategory: 'Wholesalers',
    visitOutcome: 'Order Placed',
    productCategory: 'Green Coffee Beans',
    quantity: 200,
    unitPrice: 3100,
    salesValue: 620000,
    paymentStatus: 'Credit',
    customerType: 'New Customer',
    nextFollowUpDate: '2026-09-12',
    remarks: 'First order — credit terms agreed for 30 days',
  },
  {
    id: 'visit-006',
    timestamp: '2026-09-02T09:00:00',
    salesperson: 'Karenzi Remmy',
    dateOfVisit: '2026-09-02',
    customerName: 'Marriott Kigali',
    area: 'Kigali Centre',
    customerCategory: 'Hotels',
    visitOutcome: 'Order Placed',
    productCategory: '250G Roasted Coffee',
    quantity: 200,
    unitPrice: 2600,
    salesValue: 520000,
    paymentStatus: 'Paid',
    customerType: 'Existing Customer',
    nextFollowUpDate: '2026-09-16',
    remarks: '',
  },
  {
    id: 'visit-007',
    timestamp: '2026-09-02T10:45:00',
    salesperson: 'Mastiko Frank',
    dateOfVisit: '2026-09-02',
    customerName: 'Quickmart Gisozi',
    area: 'Gisozi',
    customerCategory: 'Supermarkets',
    visitOutcome: 'Follow-up Required',
    productCategory: 'Instant Coffee Sachets',
    quantity: 0,
    unitPrice: 1200,
    salesValue: 0,
    paymentStatus: 'Pending',
    customerType: 'New Customer',
    nextFollowUpDate: '2026-09-05',
    remarks: 'Needs pricing sheet — send before next visit',
  },
  {
    id: 'visit-008',
    timestamp: '2026-09-02T13:15:00',
    salesperson: 'Isimbi Patience',
    dateOfVisit: '2026-09-02',
    customerName: 'Café Botanika',
    area: 'Nyarutarama',
    customerCategory: 'Coffee Shops',
    visitOutcome: 'Order Placed',
    productCategory: '500G MG',
    quantity: 30,
    unitPrice: 4800,
    salesValue: 144000,
    paymentStatus: 'Paid',
    customerType: 'New Customer',
    nextFollowUpDate: '2026-09-16',
    remarks: 'New account — very promising monthly volume',
  },
  {
    id: 'visit-009',
    timestamp: '2026-09-01T08:30:00',
    salesperson: 'Alex Mushumba',
    dateOfVisit: '2026-09-01',
    customerName: 'Chez Lando Restaurant',
    area: 'Kacyiru',
    customerCategory: 'Coffee Shops',
    visitOutcome: 'No Order / Visit Only',
    productCategory: '250G Roasted Coffee',
    quantity: 0,
    unitPrice: 2600,
    salesValue: 0,
    paymentStatus: 'Pending',
    customerType: 'Existing Customer',
    nextFollowUpDate: '2026-09-03',
    remarks: 'Stock sufficient — revisit early September',
  },
  {
    id: 'visit-010',
    timestamp: '2026-09-01T11:00:00',
    salesperson: 'Muyenzi Dan',
    dateOfVisit: '2026-09-01',
    customerName: 'Ikirezi Natural Products',
    area: 'Kiyovu',
    customerCategory: 'Shops',
    visitOutcome: 'Order Placed',
    productCategory: 'Instant Coffee Sachets',
    quantity: 300,
    unitPrice: 1200,
    salesValue: 360000,
    paymentStatus: 'Paid',
    customerType: 'Existing Customer',
    nextFollowUpDate: '2026-09-22',
    remarks: '',
  },
];

export interface Customer {
  id: string;
  name: string;
  category: string;
  area: string;
  contactPerson: string;
  phone: string;
  salesperson: string;
  mainProduct: string;
  monthlyPotential: number;
  monthlyCapacity: number;
  status: 'Active' | 'Inactive' | 'Prospect';
  nextFollowUp: string;
  visitsThisMonth: number;
  ordersThisMonth: number;
  lastOrderDate: string;
  remarks: string;
}

export const customers: Customer[] = [
  {
    id: 'cust-001',
    name: 'Nakumatt Kigali City Mall',
    category: 'Supermarkets',
    area: 'Kigali Centre',
    contactPerson: 'Jean-Pierre Habiyaremye',
    phone: '+250 788 123 456',
    salesperson: 'Karenzi Remmy',
    mainProduct: '500G MG',
    monthlyPotential: 800000,
    monthlyCapacity: 576000,
    status: 'Active',
    nextFollowUp: '2026-09-18',
    visitsThisMonth: 3,
    ordersThisMonth: 2,
    lastOrderDate: '2026-09-04',
    remarks: 'Key account — priority service',
  },
  {
    id: 'cust-002',
    name: 'Hotel des Mille Collines',
    category: 'Hotels',
    area: 'Kigali Centre',
    contactPerson: 'Solange Niyonkuru',
    phone: '+250 788 234 567',
    salesperson: 'Mastiko Frank',
    mainProduct: '250G Roasted Coffee',
    monthlyPotential: 600000,
    monthlyCapacity: 468000,
    status: 'Active',
    nextFollowUp: '2026-09-15',
    visitsThisMonth: 2,
    ordersThisMonth: 2,
    lastOrderDate: '2026-09-04',
    remarks: 'Monthly standing order — very reliable',
  },
  {
    id: 'cust-003',
    name: 'Simba Supermarket Remera',
    category: 'Supermarkets',
    area: 'Remera',
    contactPerson: 'Emmanuel Rukundo',
    phone: '+250 788 345 678',
    salesperson: 'Isimbi Patience',
    mainProduct: '1KG Roasted Coffee',
    monthlyPotential: 700000,
    monthlyCapacity: 210000,
    status: 'Active',
    nextFollowUp: '2026-09-08',
    visitsThisMonth: 2,
    ordersThisMonth: 0,
    lastOrderDate: '2026-08-28',
    remarks: 'Manager transitions — follow up urgently',
  },
  {
    id: 'cust-004',
    name: 'Bourbon Coffee Kimihurura',
    category: 'Coffee Shops',
    area: 'Kimihurura',
    contactPerson: 'Claudine Uwase',
    phone: '+250 788 456 789',
    salesperson: 'Alex Mushumba',
    mainProduct: 'Coffee Pods 10-pack',
    monthlyPotential: 900000,
    monthlyCapacity: 726000,
    status: 'Active',
    nextFollowUp: '2026-09-20',
    visitsThisMonth: 2,
    ordersThisMonth: 2,
    lastOrderDate: '2026-09-03',
    remarks: 'Exclusive pod supply under discussion',
  },
  {
    id: 'cust-005',
    name: 'Kigali Wholesale Hub',
    category: 'Wholesalers',
    area: 'Nyabugogo',
    contactPerson: 'Théophile Nkurunziza',
    phone: '+250 788 567 890',
    salesperson: 'Muyenzi Dan',
    mainProduct: 'Green Coffee Beans',
    monthlyPotential: 1200000,
    monthlyCapacity: 620000,
    status: 'Active',
    nextFollowUp: '2026-09-12',
    visitsThisMonth: 1,
    ordersThisMonth: 1,
    lastOrderDate: '2026-09-03',
    remarks: 'New account — 30-day credit terms',
  },
  {
    id: 'cust-006',
    name: 'Marriott Kigali',
    category: 'Hotels',
    area: 'Kigali Centre',
    contactPerson: 'Bertrand Gasana',
    phone: '+250 788 678 901',
    salesperson: 'Karenzi Remmy',
    mainProduct: '250G Roasted Coffee',
    monthlyPotential: 1000000,
    monthlyCapacity: 880000,
    status: 'Active',
    nextFollowUp: '2026-09-16',
    visitsThisMonth: 2,
    ordersThisMonth: 2,
    lastOrderDate: '2026-09-02',
    remarks: 'Premium account — quarterly contract renewal due Oct',
  },
  {
    id: 'cust-007',
    name: 'Quickmart Gisozi',
    category: 'Supermarkets',
    area: 'Gisozi',
    contactPerson: 'Anitha Uwimana',
    phone: '+250 788 789 012',
    salesperson: 'Mastiko Frank',
    mainProduct: 'Instant Coffee Sachets',
    monthlyPotential: 500000,
    monthlyCapacity: 0,
    status: 'Prospect',
    nextFollowUp: '2026-09-05',
    visitsThisMonth: 1,
    ordersThisMonth: 0,
    lastOrderDate: '—',
    remarks: 'Needs pricing sheet — very promising location',
  },
  {
    id: 'cust-008',
    name: 'Café Botanika',
    category: 'Coffee Shops',
    area: 'Nyarutarama',
    contactPerson: 'Miriam Ingabire',
    phone: '+250 788 890 123',
    salesperson: 'Isimbi Patience',
    mainProduct: '500G MG',
    monthlyPotential: 400000,
    monthlyCapacity: 144000,
    status: 'Active',
    nextFollowUp: '2026-09-16',
    visitsThisMonth: 1,
    ordersThisMonth: 1,
    lastOrderDate: '2026-09-02',
    remarks: 'New account — high growth potential',
  },
  {
    id: 'cust-009',
    name: 'Chez Lando Restaurant',
    category: 'Coffee Shops',
    area: 'Kacyiru',
    contactPerson: 'Lando Nshimiyimana',
    phone: '+250 788 901 234',
    salesperson: 'Alex Mushumba',
    mainProduct: '250G Roasted Coffee',
    monthlyPotential: 350000,
    monthlyCapacity: 0,
    status: 'Active',
    nextFollowUp: '2026-09-03',
    visitsThisMonth: 1,
    ordersThisMonth: 0,
    lastOrderDate: '2026-08-15',
    remarks: 'Follow-up overdue — stock check needed',
  },
  {
    id: 'cust-010',
    name: 'Ikirezi Natural Products',
    category: 'Shops',
    area: 'Kiyovu',
    contactPerson: 'Vestine Mukamazimpaka',
    phone: '+250 788 012 345',
    salesperson: 'Muyenzi Dan',
    mainProduct: 'Instant Coffee Sachets',
    monthlyPotential: 480000,
    monthlyCapacity: 360000,
    status: 'Active',
    nextFollowUp: '2026-09-22',
    visitsThisMonth: 1,
    ordersThisMonth: 1,
    lastOrderDate: '2026-09-01',
    remarks: '',
  },
  {
    id: 'cust-011',
    name: 'Radisson Blu Kigali',
    category: 'Hotels',
    area: 'Kigali Centre',
    contactPerson: 'Christophe Murenzi',
    phone: '+250 788 111 222',
    salesperson: 'Karenzi Remmy',
    mainProduct: '250G Roasted Coffee',
    monthlyPotential: 1100000,
    monthlyCapacity: 440000,
    status: 'Active',
    nextFollowUp: '2026-09-10',
    visitsThisMonth: 0,
    ordersThisMonth: 0,
    lastOrderDate: '2026-08-20',
    remarks: 'No visit this month — at risk',
  },
  {
    id: 'cust-012',
    name: 'Nyamirambo Corner Store',
    category: 'Stores',
    area: 'Nyamirambo',
    contactPerson: 'Odette Kabasinga',
    phone: '+250 788 333 444',
    salesperson: 'Mastiko Frank',
    mainProduct: '250G Roasted Coffee',
    monthlyPotential: 200000,
    monthlyCapacity: 84000,
    status: 'Inactive',
    nextFollowUp: '2026-09-25',
    visitsThisMonth: 0,
    ordersThisMonth: 0,
    lastOrderDate: '2026-07-30',
    remarks: 'Inactive since August — re-engagement needed',
  },
];

export interface PipelineDeal {
  id: string;
  customer: string;
  area: string;
  contactPerson: string;
  potentialValue: number;
  salesperson: string;
  stage: string;
  lastContact: string;
  nextAction: string;
  followUpDate: string;
  probability: number;
  weightedValue: number;
  remarks: string;
}

export const pipelineDeals: PipelineDeal[] = [
  {
    id: 'deal-001',
    customer: 'Radisson Blu Kigali',
    area: 'Kigali Centre',
    contactPerson: 'Christophe Murenzi',
    potentialValue: 2400000,
    salesperson: 'Karenzi Remmy',
    stage: 'Proposal',
    lastContact: '2026-08-28',
    nextAction: 'Send updated pricing proposal',
    followUpDate: '2026-09-08',
    probability: 65,
    weightedValue: 1560000,
    remarks: 'Annual contract — high value',
  },
  {
    id: 'deal-002',
    customer: 'Kigali Convention Centre',
    area: 'Kigali Centre',
    contactPerson: 'Florentine Uwera',
    potentialValue: 3600000,
    salesperson: 'Mastiko Frank',
    stage: 'Closing',
    lastContact: '2026-09-02',
    nextAction: 'Final contract sign-off',
    followUpDate: '2026-09-06',
    probability: 85,
    weightedValue: 3060000,
    remarks: 'Event catering supply — near close',
  },
  {
    id: 'deal-003',
    customer: 'Kigali Wholesale Hub',
    area: 'Nyabugogo',
    contactPerson: 'Théophile Nkurunziza',
    potentialValue: 5000000,
    salesperson: 'Muyenzi Dan',
    stage: 'Contacted',
    lastContact: '2026-09-03',
    nextAction: 'Arrange product tasting session',
    followUpDate: '2026-09-10',
    probability: 40,
    weightedValue: 2000000,
    remarks: 'Large volume — needs credit facility approval',
  },
  {
    id: 'deal-004',
    customer: 'MTN Rwanda HQ Canteen',
    area: 'Nyarugenge',
    contactPerson: 'Rosine Ineza',
    potentialValue: 1800000,
    salesperson: 'Isimbi Patience',
    stage: 'Prospecting',
    lastContact: '2026-08-20',
    nextAction: 'Initial cold call / intro meeting',
    followUpDate: '2026-09-07',
    probability: 20,
    weightedValue: 360000,
    remarks: 'Corporate canteen — high volume daily',
  },
  {
    id: 'deal-005',
    customer: 'Bourbon Coffee Kimihurura',
    area: 'Kimihurura',
    contactPerson: 'Claudine Uwase',
    potentialValue: 4200000,
    salesperson: 'Alex Mushumba',
    stage: 'Proposal',
    lastContact: '2026-09-03',
    nextAction: 'Present exclusive supply agreement',
    followUpDate: '2026-09-12',
    probability: 70,
    weightedValue: 2940000,
    remarks: 'Exclusive pod deal — high strategic value',
  },
];

export interface MonthlyTarget {
  id: string;
  salesperson: string;
  target: number;
  actualSales: number;
  achievementPct: number;
  newCustomers: number;
  customerVisits: number;
  orders: number;
  outstandingFollowUps: number;
}

export const monthlyTargets: MonthlyTarget[] = [
  {
    id: 'target-001',
    salesperson: 'Karenzi Remmy',
    target: 4000000,
    actualSales: 3124800,
    achievementPct: 78.1,
    newCustomers: 1,
    customerVisits: 14,
    orders: 9,
    outstandingFollowUps: 1,
  },
  {
    id: 'target-002',
    salesperson: 'Mastiko Frank',
    target: 3500000,
    actualSales: 2187600,
    achievementPct: 62.5,
    newCustomers: 2,
    customerVisits: 11,
    orders: 6,
    outstandingFollowUps: 3,
  },
  {
    id: 'target-003',
    salesperson: 'Isimbi Patience',
    target: 3200000,
    actualSales: 2758400,
    achievementPct: 86.2,
    newCustomers: 2,
    customerVisits: 13,
    orders: 8,
    outstandingFollowUps: 1,
  },
  {
    id: 'target-004',
    salesperson: 'Alex Mushumba',
    target: 3800000,
    actualSales: 2318000,
    achievementPct: 61.0,
    newCustomers: 0,
    customerVisits: 10,
    orders: 7,
    outstandingFollowUps: 2,
  },
  {
    id: 'target-005',
    salesperson: 'Muyenzi Dan',
    target: 3600000,
    actualSales: 3312000,
    achievementPct: 92.0,
    newCustomers: 3,
    customerVisits: 12,
    orders: 9,
    outstandingFollowUps: 0,
  },
];

export const salesTrendData = [
  { month: 'Apr', target: 14800000, actual: 11200000 },
  { month: 'May', target: 15100000, actual: 13800000 },
  { month: 'Jun', target: 15100000, actual: 14600000 },
  { month: 'Jul', target: 16200000, actual: 12900000 },
  { month: 'Aug', target: 16100000, actual: 15340000 },
  { month: 'Sep', target: 18100000, actual: 13700800 },
];

export const overdueFollowUps = [
  {
    id: 'fu-001',
    customer: 'Quickmart Gisozi',
    salesperson: 'Mastiko Frank',
    dueDate: '2026-09-05',
    daysOverdue: 0,
    lastOutcome: 'Follow-up Required',
    area: 'Gisozi',
  },
  {
    id: 'fu-002',
    customer: 'Chez Lando Restaurant',
    salesperson: 'Alex Mushumba',
    dueDate: '2026-09-03',
    daysOverdue: 1,
    lastOutcome: 'No Order / Visit Only',
    area: 'Kacyiru',
  },
  {
    id: 'fu-003',
    customer: 'Radisson Blu Kigali',
    salesperson: 'Karenzi Remmy',
    dueDate: '2026-09-02',
    daysOverdue: 2,
    lastOutcome: 'No Order / Visit Only',
    area: 'Kigali Centre',
  },
  {
    id: 'fu-004',
    customer: 'Simba Supermarket Remera',
    salesperson: 'Isimbi Patience',
    dueDate: '2026-09-08',
    daysOverdue: 0,
    lastOutcome: 'No Order / Visit Only',
    area: 'Remera',
  },
  {
    id: 'fu-005',
    customer: 'MTN Rwanda HQ Canteen',
    salesperson: 'Isimbi Patience',
    dueDate: '2026-09-07',
    daysOverdue: 0,
    lastOutcome: 'Prospecting',
    area: 'Nyarugenge',
  },
  {
    id: 'fu-006',
    customer: 'Nyamirambo Corner Store',
    salesperson: 'Mastiko Frank',
    dueDate: '2026-08-30',
    daysOverdue: 5,
    lastOutcome: 'No Order / Visit Only',
    area: 'Nyamirambo',
  },
  {
    id: 'fu-007',
    customer: 'Kigali Wholesale Hub',
    salesperson: 'Muyenzi Dan',
    dueDate: '2026-09-01',
    daysOverdue: 3,
    lastOutcome: 'Follow-up Required',
    area: 'Nyabugogo',
  },
];

export function formatRWF(value: number): string {
  if (value >= 1000000) {
    return `RWF ${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `RWF ${(value / 1000).toFixed(0)}K`;
  }
  return `RWF ${value.toLocaleString()}`;
}

export function formatRWFFull(value: number): string {
  return `RWF ${value.toLocaleString('en-US')}`;
}