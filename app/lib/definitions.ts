// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type PurchaseForm = {
  item_id: string;
  date: string;
  platform: string;
  seller_username: string;
  listing_title: string;
  individual_price: number;
  quantity: number;
  shipping_price: number;
  tax: number;
  total: number;
  amount_refunded: number;
};

export type PurchaseOrderForm = {
  item_id: string;
  order_number: string;
  respective_cost: number;
};

export type OrderForm = {
  order_number: string;
  date: string; // Assuming date only, without time
  item_title: string;
  item_id: string;
  buyer_username: string;
  buyer_name: string;
  city: string;
  state: string;
  zip: string;
  quantity: number;
  item_subtotal: number;
  shipping_handling: number;
  ebay_collected_tax: number;
  fv_fixed: number;
  fv_variable: number;
  international_fee: number;
  gross_amount: number;
  net_amount: number;
};

export type Purchase = {
  item_id: string;
  date: string;
  platform: string;
  seller_username: string;
  listing_title: string;
  individual_price: number;
  quantity: number;
  shipping_price: number;
  tax: number;
  total: number;
  amount_refunded: number;
  cost_accounted: number; // added to the type
  cost_outstanding: number; // added to the type
};

export type PurchaseOrder = {
  item_id: string;
  date: string;
  platform: string;
  seller_username: string;
  listing_title: string;
  individual_price: number;
  quantity: number;
  shipping_price: number;
  tax: number;
  total: number;
  amount_refunded: number;
  respective_cost: number;
};


