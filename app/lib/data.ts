import { sql } from '@vercel/postgres';
import {
  CustomerField,
  LatestInvoiceRaw,
  User,
  Revenue, PurchaseForm,
  OrderForm, PurchaseOrder, Purchase, Label, Refund, DollarMonth, DollarYear
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

export async function fetchProfitAccrualMonthly(year: number) {
  noStore();
  try {
    const data = await sql<DollarMonth>`
      SELECT
        TO_CHAR(DATE_TRUNC('month', o.date), 'Mon') AS month,
        SUM(o.net_amount - COALESCE(po.purchase_cost, 0) - COALESCE(lb.total_label_cost, 0) - COALESCE(rf.total_refund_amount, 0)) AS dollar
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
          SUM(r.net_amount) AS total_refund_amount
        FROM refund_orders ro
        INNER JOIN refunds r ON ro.refund_id = r.id
        GROUP BY ro.order_number
      ) rf ON o.order_number = rf.order_number
      WHERE EXTRACT(YEAR FROM o.date) = ${year}
      GROUP BY DATE_TRUNC('month', o.date)
      ORDER BY DATE_TRUNC('month', o.date);
    `;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch profit accrual data.');
  }
}

export async function fetchProfitCashMonthly(year: number) {
  noStore();
  try {
    const data = await sql<DollarMonth>`
      WITH monthly_orders AS (
        SELECT
            date_trunc('month', date) AS month,
            SUM(net_amount) AS total_net_amount
        FROM
            orders
        WHERE
            EXTRACT(YEAR FROM date) = ${year}
        GROUP BY
            month
      ),
      monthly_refunds AS (
        SELECT
            date_trunc('month', date) AS month,
            SUM(net_amount) AS total_net_refund
        FROM
            refunds
        WHERE
            EXTRACT(YEAR FROM date) = ${year}
        GROUP BY
            month
      ),
      monthly_labels AS (
        SELECT
            date_trunc('month', date) AS month,
            SUM(cost) AS total_label_cost
        FROM
            labels
        WHERE
            EXTRACT(YEAR FROM date) = ${year}
        GROUP BY
            month
      ),
      monthly_purchases AS (
        SELECT
            date_trunc('month', date) AS month,
            SUM(total) AS total_purchase,
            SUM(amount_refunded) AS total_refunded
        FROM
            purchases
        WHERE
            EXTRACT(YEAR FROM date) = ${year}
        GROUP BY
            month
      ),
      monthly_consumables AS (
        SELECT
            date_trunc('month', date) AS month,
            SUM(cost) AS total_consumable_cost
        FROM
            consumables
        WHERE
            EXTRACT(YEAR FROM date) = ${year}
        GROUP BY
            month
      )
      SELECT
          to_char(mo.month, 'Mon') AS month,
          COALESCE(mo.total_net_amount, 0) - 
          COALESCE(mr.total_net_refund, 0) -
          COALESCE(ml.total_label_cost, 0) -
          COALESCE(mp.total_purchase, 0) + 
          COALESCE(mp.total_refunded, 0) -
          COALESCE(mc.total_consumable_cost, 0) AS dollar
      FROM
          monthly_orders mo
      FULL OUTER JOIN monthly_refunds mr ON mo.month = mr.month
      FULL OUTER JOIN monthly_labels ml ON mo.month = ml.month
      FULL OUTER JOIN monthly_purchases mp ON mo.month = mp.month
      FULL OUTER JOIN monthly_consumables mc ON mo.month = mc.month
      ORDER BY
          mo.month;
    `;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch profit accrual data.');
  }
}




export async function fetchProfitAccrualYearly() {
    noStore();
    try {
        const data = await sql<DollarYear>`
        SELECT
            TO_CHAR(DATE_TRUNC('year', o.date), 'YYYY') AS year,
            SUM(o.net_amount - COALESCE(po.purchase_cost, 0) - COALESCE(lb.total_label_cost, 0) - COALESCE(rf.total_refund_amount, 0)) AS dollar
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
            SUM(r.net_amount) AS total_refund_amount
            FROM refund_orders ro
            INNER JOIN refunds r ON ro.refund_id = r.id
            GROUP BY ro.order_number
        ) rf ON o.order_number = rf.order_number
        GROUP BY DATE_TRUNC('year', o.date)
        ORDER BY DATE_TRUNC('year', o.date);
        `;

        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch profit accrual data.');
    }
}


export async function fetchProfitCashYearly() {
  noStore();
  try {
    const data = await sql<DollarYear>`
      WITH yearly_orders AS (
        SELECT
            date_trunc('year', date) AS year,
            SUM(net_amount) AS total_net_amount
        FROM
            orders
        GROUP BY
            year
      ),
      yearly_refunds AS (
        SELECT
            date_trunc('year', date) AS year,
            SUM(net_amount) AS total_net_refund
        FROM
            refunds
        GROUP BY
            year
      ),
      yearly_labels AS (
        SELECT
            date_trunc('year', date) AS year,
            SUM(cost) AS total_label_cost
        FROM
            labels
        GROUP BY
            year
      ),
      yearly_purchases AS (
        SELECT
            date_trunc('year', date) AS year,
            SUM(total) AS total_purchase,
            SUM(amount_refunded) AS total_refunded
        FROM
            purchases
        GROUP BY
            year
      ),
      yearly_consumables AS (
        SELECT
            date_trunc('year', date) AS year,
            SUM(cost) AS total_consumable_cost
        FROM
            consumables
        GROUP BY
            year
      )
      SELECT
          to_char(yo.year, 'YYYY') AS year,
          COALESCE(yo.total_net_amount, 0) - 
          COALESCE(yr.total_net_refund, 0) -
          COALESCE(yl.total_label_cost, 0) -
          COALESCE(yp.total_purchase, 0) + 
          COALESCE(yp.total_refunded, 0) -
          COALESCE(yc.total_consumable_cost, 0) AS dollar
      FROM
          yearly_orders yo
      FULL OUTER JOIN yearly_refunds yr ON yo.year = yr.year
      FULL OUTER JOIN yearly_labels yl ON yo.year = yl.year
      FULL OUTER JOIN yearly_purchases yp ON yo.year = yp.year
      FULL OUTER JOIN yearly_consumables yc ON yo.year = yc.year
      ORDER BY
          yo.year;
    `;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch profit data.');
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
    const revenuePromise = sql`
        SELECT SUM(gross_amount) AS total_revenue
        FROM orders
        WHERE DATE_TRUNC('year', date) = '2023-01-01';
    `;
    const profitPromise = sql`
      SELECT
        SUM(o.net_amount - COALESCE(po.purchase_cost, 0) - COALESCE(lb.total_label_cost, 0) - COALESCE(rf.total_refund_amount, 0)) AS total_profit
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
          SUM(r.net_amount) AS total_refund_amount
        FROM refund_orders ro
        INNER JOIN refunds r ON ro.refund_id = r.id
        GROUP BY ro.order_number
      ) rf ON o.order_number = rf.order_number
      WHERE EXTRACT(YEAR FROM o.date) = 2023
      GROUP BY DATE_TRUNC('year', o.date);
    `;
    const salesPromise = sql`
      SELECT
      COUNT(order_number) AS total_sales
      FROM orders;
    `;
    const expensesPromise = sql`
      SELECT
        SUM(cost) AS total_expenses
      FROM consumables;
    `;

    const data = await Promise.all([
      revenuePromise,
      profitPromise,
      salesPromise,
      expensesPromise
    ]);

    const revenue = data[0].rows[0].total_revenue;
    const profit = data[1].rows[0].total_profit;
    const sales = data[2].rows[0].total_sales;
    const expenses = data[3].rows[0].total_expenses;

    return {
      revenue,
      profit,
      sales,
      expenses,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 50;

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
          SUM(r.net_amount) AS total_refund_amount
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

export async function fetchFilteredSubscriptions(query: string, currentPage: number) {
  noStore(); // Assuming this function is defined elsewhere to prevent caching
  const offset = (currentPage - 1) * ITEMS_PER_EXPENSE_PAGE;

  try {
    const subscriptions = await sql`
      SELECT
        id,
        service,
        frequency,
        begin_date,
        cost,
        archived_cost
      FROM subscriptions
      WHERE
        id::text ILIKE ${`%${query}%`} OR
        service ILIKE ${`%${query}%`} OR
        frequency ILIKE ${`%${query}%`} OR
        begin_date::text ILIKE ${`%${query}%`} OR
        cost::text ILIKE ${`%${query}%`} OR
        archived_cost::text ILIKE ${`%${query}%`}
      ORDER BY begin_date DESC
      LIMIT ${ITEMS_PER_EXPENSE_PAGE} OFFSET ${offset}
    `;

    return subscriptions.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch subscriptions.');
  }
}

export async function fetchFilteredConsumables(query: string, currentPage: number) {
  noStore(); // Assuming this function is defined elsewhere to prevent caching
  const offset = (currentPage - 1) * ITEMS_PER_EXPENSE_PAGE;

  try {
    const consumables = await sql`
      SELECT
        id,
        item,
        cost,
        date
      FROM consumables
      WHERE
        id::text ILIKE ${`%${query}%`} OR
        item ILIKE ${`%${query}%`} OR
        cost::text ILIKE ${`%${query}%`} OR
        date::text ILIKE ${`%${query}%`}
      ORDER BY date DESC
      LIMIT ${ITEMS_PER_EXPENSE_PAGE} OFFSET ${offset}
    `;

    return consumables.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch consumables.');
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

const ITEMS_PER_EXPENSE_PAGE = 50; // or whatever your page size is

export async function fetchConsumablesPages(query: string) {
  noStore(); // Assuming this function is defined elsewhere to prevent caching
  try {
    const count = await sql`SELECT COUNT(*)
    FROM consumables
    WHERE
      item ILIKE ${`%${query}%`} OR
      cost::text ILIKE ${`%${query}%`} OR
      date::text ILIKE ${`%${query}%`} OR
      id::text ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_EXPENSE_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of consumables pages.');
  }
}

export async function fetchSubscriptionsPages(query: string) {
  noStore(); // Assuming this function is defined elsewhere to prevent caching
  try {
    const count = await sql`SELECT COUNT(*)
    FROM subscriptions
    WHERE
      service ILIKE ${`%${query}%`} OR
      frequency ILIKE ${`%${query}%`} OR
      begin_date::text ILIKE ${`%${query}%`} OR
      cost::text ILIKE ${`%${query}%`} OR
      archived_cost::text ILIKE ${`%${query}%`} OR
      id::text ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_EXPENSE_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of subscriptions pages.');
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

export async function fetchLabelByID(tracking_number: string) {
    noStore(); // Assuming this function is defined elsewhere to prevent caching
    try {
        const data = await sql<Label>`
        SELECT
            tracking_number,
            shipping_service,
            cost,
            date,
            buyer_username,
            notes
        FROM labels
        WHERE tracking_number = ${tracking_number};
        `;

        const label = data.rows.map((label) => ({
        ...label,
        }));

        return label[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch label by ID.');
    }
}

export async function fetchRefundByID(id: number) {
    noStore(); // Assuming this function is defined elsewhere to prevent caching
    try {
        const data = await sql<Refund>`
        SELECT
            id,
            gross_amount,
            refund_type,
            fv_fixed_credit,
            fv_variable_credit,
            ebay_tax_refunded,
            net_amount,
            date
        FROM refunds
        WHERE id = ${id};
        `;

        const refund = data.rows.map((refund) => ({
        ...refund,
        }));

        return refund[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch refund by ID.');
    }
}

export async function fetchLabels(order_number: string) {
  noStore(); // Assuming this function is defined elsewhere to prevent caching
  try {
    const data = await sql<Label>`
      SELECT
    l.tracking_number,
    l.shipping_service,
    l.cost,
    l.date,
    l.buyer_username,
    l.notes
FROM labels l
JOIN label_orders lo ON l.tracking_number = lo.tracking_number
WHERE lo.order_number = ${order_number};
    `;

    const labelOrders = data.rows.map((labelOrder) => ({
      ...labelOrder,
    }));

    return labelOrders;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch label orders.');
  }
}

export async function fetchRefunds(order_number: string) {
  noStore(); // Assuming this function is defined elsewhere to prevent caching
  try {
    const data = await sql<Refund>`
      SELECT
        r.id,
        r.gross_amount,
        r.refund_type,
        r.fv_fixed_credit,
        r.fv_variable_credit,
        r.ebay_tax_refunded,
        r.net_amount,
        r.date
      FROM refunds r
      JOIN refund_orders ro ON r.id = ro.refund_id
      WHERE ro.order_number = ${order_number};
    `;

    const refunds = data.rows.map((refund) => ({
      ...refund,
    }));

    return refunds;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch refunds.');
  }
}

export async function fetchPurchaseOrderByID(order_number: string, item_id: string) {
  noStore(); // Assuming this function is defined elsewhere to prevent caching
  try {
    const data = await sql<PurchaseOrder>`
      SELECT
        item_id,
        order_number,
        respective_cost
      FROM purchase_orders
      WHERE order_number = ${order_number} AND item_id = ${item_id};
    `;

    const purchaseOrder = data.rows.map((purchaseOrder) => ({
      ...purchaseOrder,
    }));

    return purchaseOrder[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch purchase order by ID.');
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
        WHERE item_id = ${itemID}
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


