import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue, PurchaseForm,
    OrderForm, PurchaseOrder, Purchase
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';


export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  noStore();
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 50;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchFilteredOrders(query: string, currentPage: number) {
  noStore(); // This function should be defined elsewhere to prevent caching
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const orders = await sql`
      SELECT
        o.order_number,
        o.date,
        o.item_title,
        o.item_id,
        o.buyer_username,
        o.buyer_name,
        o.city,
        o.state,
        o.zip,
        o.quantity,
        o.item_subtotal,
        o.shipping_handling,
        o.ebay_collected_tax,
        o.fv_fixed,
        o.fv_variable,
        o.international_fee,
        o.gross_amount,
        o.net_amount,
        COALESCE(po.purchase_cost, 0) AS purchase_cost,
        COALESCE(lb.total_label_cost, 0) AS label_cost,
        COALESCE(rf.total_refund_amount, 0) AS refunded
      FROM orders o
      LEFT JOIN (
        SELECT
          order_number,
          SUM(respective_cost) AS purchase_cost
        FROM purchase_orders
        GROUP BY order_number
      ) po ON o.order_number = po.order_number
      LEFT JOIN (
        SELECT
          lo.order_number,
          SUM(l.cost) AS total_label_cost
        FROM label_orders lo
        INNER JOIN labels l ON lo.tracking_number = l.tracking_number
        GROUP BY lo.order_number
      ) lb ON o.order_number = lb.order_number
      LEFT JOIN (
        SELECT
          ro.order_number,
          SUM(r.gross_amount) AS total_refund_amount
        FROM refund_orders ro
        INNER JOIN refunds r ON ro.refund_id = r.id
        GROUP BY ro.order_number
      ) rf ON o.order_number = rf.order_number
      WHERE
        o.buyer_username ILIKE ${`%${query}%`} OR
        o.buyer_name ILIKE ${`%${query}%`} OR
        o.city ILIKE ${`%${query}%`} OR
        o.state ILIKE ${`%${query}%`} OR
        o.zip ILIKE ${`%${query}%`} OR
        o.item_title ILIKE ${`%${query}%`} OR
        o.order_number ILIKE ${`%${query}%`} OR
        o.item_id ILIKE ${`%${query}%`} OR
        o.quantity::text ILIKE ${`%${query}%`} OR
        o.item_subtotal::text ILIKE ${`%${query}%`} OR
        o.shipping_handling::text ILIKE ${`%${query}%`} OR
        o.ebay_collected_tax::text ILIKE ${`%${query}%`} OR
        o.fv_fixed::text ILIKE ${`%${query}%`} OR
        o.fv_variable::text ILIKE ${`%${query}%`} OR
        o.international_fee::text ILIKE ${`%${query}%`} OR
        o.gross_amount::text ILIKE ${`%${query}%`} OR
        o.net_amount::text ILIKE ${`%${query}%`} OR
        o.date::text ILIKE ${`%${query}%`}
      ORDER BY o.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return orders.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch orders.');
  }
}



export async function fetchFilteredPurchases(query: string, currentPage: number) {
  noStore(); // Assuming this function is defined elsewhere to prevent caching
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const purchases = await sql`
      SELECT
        p.item_id,
        p.date,
        p.platform,
        p.seller_username,
        p.listing_title,
        p.individual_price,
        p.quantity,
        p.shipping_price,
        p.tax,
        p.total,
        p.amount_refunded,
        COALESCE(po.cost_accounted, 0) AS cost_accounted,
        (p.total - p.amount_refunded - COALESCE(po.cost_accounted, 0)) AS cost_outstanding
      FROM purchases p
      LEFT JOIN (
        SELECT
          item_id,
          SUM(respective_cost) AS cost_accounted
        FROM purchase_orders
        GROUP BY item_id
      ) po ON p.item_id = po.item_id
      WHERE
        p.seller_username ILIKE ${`%${query}%`} OR
        p.listing_title ILIKE ${`%${query}%`} OR
        p.platform ILIKE ${`%${query}%`} OR
        p.item_id ILIKE ${`%${query}%`} OR
        p.quantity::text ILIKE ${`%${query}%`} OR
        p.individual_price::text ILIKE ${`%${query}%`} OR
        p.shipping_price::text ILIKE ${`%${query}%`} OR
        p.tax::text ILIKE ${`%${query}%`} OR
        p.total::text ILIKE ${`%${query}%`} OR
        p.amount_refunded::text ILIKE ${`%${query}%`} OR
        p.date::text ILIKE ${`%${query}%`}
      ORDER BY p.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    const result = purchases.rows.map(purchase => ({
      ...purchase,
      cost_accounted: parseFloat(purchase.cost_accounted),
      cost_outstanding: parseFloat(purchase.cost_outstanding)
    }));
    return result as Purchase[];

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch filtered purchases.');
  }
}



export async function fetchInvoicesPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchOrdersPages(query: string) {
  noStore(); // Assuming this function is defined elsewhere to prevent caching
  try {
    const count = await sql`SELECT COUNT(*)
    FROM orders
    WHERE
      buyer_username ILIKE ${`%${query}%`} OR
      buyer_name ILIKE ${`%${query}%`} OR
      city ILIKE ${`%${query}%`} OR
      state ILIKE ${`%${query}%`} OR
      zip ILIKE ${`%${query}%`} OR
      item_title ILIKE ${`%${query}%`} OR
      order_number ILIKE ${`%${query}%`} OR
      item_id ILIKE ${`%${query}%`} OR
      quantity::text ILIKE ${`%${query}%`} OR
      item_subtotal::text ILIKE ${`%${query}%`} OR
      shipping_handling::text ILIKE ${`%${query}%`} OR
      ebay_collected_tax::text ILIKE ${`%${query}%`} OR
      fv_fixed::text ILIKE ${`%${query}%`} OR
      fv_variable::text ILIKE ${`%${query}%`} OR
      international_fee::text ILIKE ${`%${query}%`} OR
      gross_amount::text ILIKE ${`%${query}%`} OR
      net_amount::text ILIKE ${`%${query}%`} OR
      date::text ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of sales pages.');
  }
}

export async function fetchPurchasesPages(query: string) {
  noStore(); // Assuming this function is defined elsewhere to prevent caching
  try {
    const count = await sql`SELECT COUNT(*)
    FROM purchases
    WHERE
      seller_username ILIKE ${`%${query}%`} OR
      listing_title ILIKE ${`%${query}%`} OR
      platform ILIKE ${`%${query}%`} OR
      item_id ILIKE ${`%${query}%`} OR
      date::text ILIKE ${`%${query}%`} OR
      individual_price::text ILIKE ${`%${query}%`} OR
      quantity::text ILIKE ${`%${query}%`} OR
      shipping_price::text ILIKE ${`%${query}%`} OR
      tax::text ILIKE ${`%${query}%`} OR
      total::text ILIKE ${`%${query}%`} OR
      amount_refunded::text ILIKE ${`%${query}%`}
    `;

    const ITEMS_PER_PAGE = 50; // You should define this constant somewhere in your code.
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of purchases pages.');
  }
}




export async function fetchOrderByOrderNumber(orderNumber: string) {
  noStore(); // Assuming this function is defined elsewhere to prevent caching
  try {
    const data = await sql<OrderForm>`
      SELECT
        order_number,
        date,
        item_title,
        item_id,
        buyer_username,
        buyer_name,
        city,
        state,
        zip,
        quantity,
        item_subtotal,
        shipping_handling,
        ebay_collected_tax,
        fv_fixed,
        fv_variable,
        international_fee,
        gross_amount,
        net_amount
      FROM orders
      WHERE order_number = ${orderNumber};
    `;

    const order = data.rows.map((order) => ({
      ...order,
    }));

    return order[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch order by ID.');
  }
}

export async function fetchPurchaseByItemID(itemID: string) {
  noStore(); // Assuming this function is defined elsewhere to prevent caching
  try {
    const data = await sql<PurchaseForm>`
      SELECT
        item_id,
        date,
        platform,
        seller_username,
        listing_title,
        individual_price,
        quantity,
        shipping_price,
        tax,
        total,
        amount_refunded
      FROM purchases
      WHERE item_id = ${itemID};
    `;
    const purchase = data.rows.map((purchase) => ({
      ...purchase,
    }));

    return purchase[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch purchase by item ID.');
  }
}


export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  noStore();
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function getUser(email: string) {
  noStore();
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function fetchPurchaseOrders(order_number: string) {
  // noStore(); // If you have a function to prevent caching, uncomment this line

  try {
    const purchaseOrders = await sql`
      SELECT
        p.item_id,
        p.date,
        p.platform,
        p.seller_username,
        p.listing_title,
        p.individual_price,
        p.quantity,
        p.shipping_price,
        p.tax,
        p.total,
        p.amount_refunded,
        po.respective_cost
      FROM purchase_orders po
      JOIN purchases p ON p.item_id = po.item_id
      WHERE po.order_number = ${order_number}
      ORDER BY p.date DESC
    `;

    // Map and return the result as needed
    const result = purchaseOrders.rows.map(purchaseOrder => ({
      ...purchaseOrder,
      respective_cost: parseFloat(purchaseOrder.respective_cost)
    }));
    return result as PurchaseOrder[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch purchase orders.');
  }
}

export async function fetchPurchaseWithCostsByItemID(itemID: string) {
  noStore(); // Assuming this function is defined elsewhere to prevent caching
  try {
    const data = await sql<Purchase>`
      SELECT
        p.item_id,
        p.date,
        p.platform,
        p.seller_username,
        p.listing_title,
        p.individual_price,
        p.quantity,
        p.shipping_price,
        p.tax,
        p.total,
        p.amount_refunded,
        COALESCE(po.cost_accounted, 0) AS cost_accounted,
        (p.total - p.amount_refunded - COALESCE(po.cost_accounted, 0)) AS cost_outstanding
      FROM purchases p
      LEFT JOIN (
        SELECT
          item_id,
          SUM(respective_cost) AS cost_accounted
        FROM purchase_orders
        WHERE item_id = ${itemID} // Ensures that we are only summing costs related to the queried item_id
        GROUP BY item_id
      ) po ON p.item_id = po.item_id
      WHERE p.item_id = ${itemID};
    `;

    const purchase = data.rows.map((purchase) => ({
      ...purchase,
      cost_accounted: purchase.cost_accounted,
      cost_outstanding: purchase.cost_outstanding
    }));

    return purchase[0]; // Assuming there's only one record for each item ID
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch purchase by item ID.');
  }
}

export async function fetchAllPurchasesWithCostOutstanding() {
  noStore(); // Assuming this function is defined elsewhere to prevent caching
  try {
    const data = await sql<Purchase>`
      SELECT
        p.item_id,
        p.date,
        p.platform,
  p.seller_username,
  p.listing_title,
  p.individual_price,
  p.quantity,
  p.shipping_price,
  p.tax,
  p.total,
  p.amount_refunded,
  COALESCE(po.cost_accounted, 0) AS cost_accounted,
  (p.total - p.amount_refunded - COALESCE(po.cost_accounted, 0)) AS cost_outstanding
FROM purchases p
LEFT JOIN (
  SELECT
    item_id,
    SUM(respective_cost) AS cost_accounted
  FROM purchase_orders
  GROUP BY item_id
) po ON p.item_id = po.item_id
ORDER BY p.date DESC;

    `;
    const purchases = data.rows.map((data) => ({
        ...data,
    }));
    return purchases;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all purchases with cost outstanding.');
  }
}


