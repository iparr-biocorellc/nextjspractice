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

export type Revenue = {
  month: string;
  revenue: number;
};

export type DollarMonth = {
  month: string;
  dollar: number;
};

export type DollarYear = {
    year: number;
    dollar: number;
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


export type CustomerField = {
  id: string;
  name: string;
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

export type Label = {
  tracking_number: string;
  shipping_service: string;
  cost: number;
  date: string;
  buyer_username: string;
  notes: string;
};

export type Refund = {
  id: number;
  gross_amount: number;
  refund_type: string;
  fv_fixed_credit: number;
  fv_variable_credit: number;
  ebay_tax_refunded: number;
  net_amount: number;
  date: string;
};

export type Consumable = {
    id: number;
    date: string;
    item: string;
    cost: number;
};

export type Subscription = {
    id: number;
    service: string;
    frequency: string;
    begin_date: string;
    cost: number;
    archived_cost: number;
};






