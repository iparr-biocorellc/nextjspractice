'use server';
import { signIn, createUser } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

const OrderData = z.object({
    order_number: z.string(),
    date: z.string(),
    item_title: z.string(),
    item_id: z.string(),
    buyer_username: z.string(),
    buyer_name: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    quantity: z.number(),
    item_subtotal: z.number(),
    shipping_handling: z.number(),
    ebay_collected_tax: z.number(),
    fv_fixed: z.number(),
    fv_variable: z.number(),
    international_fee: z.number(),
    gross_amount: z.number(),
    net_amount: z.number(),
});
export type orderState = {
    errors?: {
        order_number?: string[];
        date?: string[];
        item_title?: string[];
        item_id?: string[];
        buyer_username?: string[];
        buyer_name?: string[];
        city?: string[];
        state?: string[];
        zip?: string[];
        quantity?: string[];
        item_subtotal?: string[];
        shipping_handling?: string[];
        ebay_collected_tax?: string[];
        fv_fixed?: string[];
        fv_variable?: string[];
        international_fee?: string[];
        gross_amount?: string[];
        net_amount?: string[];
    };
    message?: string | null;
};

// Define the schema for purchase data validation
const PurchaseData = z.object({
    item_id: z.string(),
    date: z.string(),
    platform: z.string(),
    seller_username: z.string(),
    listing_title: z.string(),
    individual_price: z.number(),
    quantity: z.number(),
    shipping_price: z.number(),
    tax: z.number(),
    total: z.number(),
    amount_refunded: z.number(),
});

// Define the type for the state of the purchase upload
export type purchaseState = {
    errors?: {
        item_id?: string[];
        date?: string[];
        platform?: string[];
        seller_username?: string[];
        listing_title?: string[];
        individual_price?: string[];
        quantity?: string[];
        shipping_price?: string[];
        tax?: string[];
        total?: string[];
        amount_refunded?: string[];
    };
    message?: string | null;
};

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
    // Validate form using Zod
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    // Insert data into the database
    try {
        await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
    } catch (error) {
        // If a database error occurs, return a more specific error.
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData,
) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update Invoice.' };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }
}

export async function deleteOrder(order_number: string) {
    try {
        await sql`DELETE FROM orders WHERE order_number = ${order_number}`;
        revalidatePath('/dashboard/sales');
        return { message: 'Deleted Order.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Order.' };
    }
}

export async function deletePurchase(itemID: string) {
    try {
        await sql`DELETE FROM purchases WHERE item_id = ${itemID}`;
        revalidatePath('/dashboard/purchases');
        return { message: 'Deleted Purchase.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Purchase.' };
    }
}


export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}
export async function signUp(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        // Assuming `createUser` is a function that takes `FormData` and signs up a new user
        await createUser(formData);
    } catch (error) {
        // Checking if the error is an instance of Error to safely access its message property
        if (error instanceof Error) {
            // Matching the error message directly since we're not using AuthError
            if (error.message === 'Email already exists.') {
                return 'Email already exists.';
            } else if (error.message === 'Email and password are required.') {
                return 'Email and password are required.';
            } else {
                // Handle other errors that may not have been explicitly thrown by us
                return 'Something went wrong during signup.';
            }
        } else {
            // If it's not an Error instance, rethrow it
            throw error;
        }
    }
    redirect('/login');
}

function excelSerialDateToDate(serial:number) {
    const utc_days  = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);

    // Optional: to get the date in the local timezone offset
    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    let total_seconds = Math.floor(86400 * fractional_day);
    const seconds = total_seconds % 60;
    total_seconds -= seconds;
    const hours = Math.floor(total_seconds / (60 * 60));
    const minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

export async function uploadOrders(ordersData: any[]): Promise<orderState> {
    ordersData = ordersData.map((row: any) => {
        // Convert Excel date serial number to JavaScript Date object
        const date = excelSerialDateToDate(row.date);
        // Convert JavaScript Date object to 'YYYY-MM-DD' string format
        const formattedDate = date.toISOString().split('T')[0];

        return {
            ...row,
            item_id: String(row.item_id),
            zip: String(row.zip),
            state: String(row.state),
            date: formattedDate,
        };
    });
    try {
        // Validate each order data record
        const parsedOrders = ordersData.map(data => OrderData.parse(data));
        for (const order of parsedOrders) {
            await sql`
            INSERT INTO orders (
                order_number, date, item_title, item_id, buyer_username, buyer_name,
                city, state, zip, quantity, item_subtotal, shipping_handling,
                ebay_collected_tax, fv_fixed, fv_variable, international_fee,
                gross_amount, net_amount
            ) VALUES (
                ${order.order_number}, ${order.date}, ${order.item_title}, ${order.item_id}, ${order.buyer_username},
                ${order.buyer_name}, ${order.city}, ${order.state}, ${order.zip}, ${order.quantity},
                ${order.item_subtotal}, ${order.shipping_handling}, ${order.ebay_collected_tax},
                ${order.fv_fixed}, ${order.fv_variable}, ${order.international_fee},
                ${order.gross_amount}, ${order.net_amount}
            )
        `;
        }
        return { message: 'Successfully uploaded order data.' };
    } catch (error) {
        // Handle validation or SQL errors
        console.error('Failed to upload order data:', error);
        if (error instanceof z.ZodError) {
            // Transform ZodError into a structure compatible with `orderState`
            const fieldErrors = error.flatten().fieldErrors;
            let errors: any = {};
            for (const key of Object.keys(fieldErrors)) {
                errors[key] = fieldErrors[key];
            }
            return { message: 'Failed to upload order data.', errors };
        } else {
            return { message: `Database Error: ${(error as Error)?.message ?? 'An unknown error occurred.'}` };
        }
    }
}

// Function to upload purchases data
export async function uploadPurchases(purchasesData: any[]): Promise<purchaseState> {
    purchasesData = purchasesData.map((row: any) => {
        // Assuming there is a function excelSerialDateToDate to convert Excel dates
        const date = excelSerialDateToDate(row.date);
        // Format the date as 'YYYY-MM-DD'
        const formattedDate = date.toISOString().split('T')[0];

        return {
            ...row,
            date: formattedDate,
        };
    });

    try {
        // Validate each purchase data record against the Zod schema
        const parsedPurchases = purchasesData.map(data => PurchaseData.parse(data));
        for (const purchase of parsedPurchases) {
            await sql`
        INSERT INTO purchases (
          item_id, date, platform, seller_username, listing_title, 
          individual_price, quantity, shipping_price, tax, total, amount_refunded
        ) VALUES (
          ${purchase.item_id}, ${purchase.date}, ${purchase.platform}, 
          ${purchase.seller_username}, ${purchase.listing_title}, 
          ${purchase.individual_price}, ${purchase.quantity}, 
          ${purchase.shipping_price}, ${purchase.tax}, ${purchase.total}, 
          ${purchase.amount_refunded}
        )
      `;
        }
        return { message: 'Successfully uploaded purchase data.' };
    } catch (error) {
        // Handle errors
        console.error('Failed to upload purchase data:', error);
        if (error instanceof z.ZodError) {
            // Transform ZodError into a structure compatible with `purchaseState`
            const fieldErrors = error.flatten().fieldErrors;
            let errors: any = {};
            for (const key of Object.keys(fieldErrors)) {
                errors[key] = fieldErrors[key];
            }
            return { message: 'Failed to upload purchase data.', errors };
        } else {
            return { message: `Database Error: ${(error as Error)?.message ?? 'An unknown error occurred.'}` };
        }
    }
}