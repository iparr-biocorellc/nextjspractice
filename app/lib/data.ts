import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
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

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');

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

const ITEMS_PER_PAGE = 100;
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
  noStore(); // Assuming this function is defined elsewhere to prevent caching
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const orders = await sql`
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
      ORDER BY date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return orders.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch orders.');
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

export async function fetchOrderByOrderNumber(orderNumber: string) {
  noStore(); // Assuming this function is defined elsewhere to prevent caching
  try {
    const data = await sql`
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

    // Directly return the first item, assuming order numbers are unique
    const order = data.rows[0] ? {
      ...data.rows[0],
      // Format date if necessary
    } : null;

    return order;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch order by ID.');
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
