'use server';
import { signIn, createUser } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import XLSX from 'xlsx';

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

export async function processSalesUpload(prevState: orderState, formData: FormData) {
    // The file is an excel spreadsheet that does have headers
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    const data = await new Promise<any[]>((resolve) => {
        reader.onload = (e) => {
            if (!e.target) {
                console.error('Event target is null');
                return; // Early return if e.target is null
            }
            const data = new Uint8Array(e.target.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            resolve(rows.slice(1));
        };
    });
    console.log(data)
    // Attempt to insert each row into the database
    try {
        for (const row of data) {
            const validatedFields = OrderData.safeParse({
                order_number: row.order_number,
                item_title: row.item_title,
                item_id: row.item_id,
                buyer_username: row.buyer_username,
                buyer_name: row.buyer_name,
                city: row.city,
                state: row.state,
                zip: row.zip,
                quantity: row.quantity,
                item_subtotal: row.item_subtotal,
                shipping_handling: row.shipping_handling,
                ebay_collected_tax: row.ebay_collected_tax,
                fv_fixed: row.fv_fixed,
                fv_variable: row.fv_variable,
                international_fee: row.international_fee,
                gross_amount: row.gross_amount,
                net_amount: row.net_amount,
            });
            if (!validatedFields.success) {
                return {
                    errors: validatedFields.error.flatten().fieldErrors,
                    message: 'Missing Fields. Failed to Update Invoice.',
                };
            }
            const { order_number, item_title, item_id, buyer_username, buyer_name, city, state, zip, quantity, item_subtotal, shipping_handling, ebay_collected_tax, fv_fixed, fv_variable, international_fee, gross_amount, net_amount } = validatedFields.data;

            // Convert necessary fields to the correct type, e.g., converting strings to numbers
            await sql`
                INSERT INTO orders (order_number, item_title, item_id, buyer_username, buyer_name, city, state, zip, quantity, item_subtotal, shipping_handling, ebay_collected_tax, fv_fixed, fv_variable, international_fee, gross_amount, net_amount)
                VALUES (${order_number}, ${item_title}, ${item_id}, ${buyer_username}, ${buyer_name}, ${city}, ${state}, ${zip}, ${quantity}, ${+item_subtotal}, ${+shipping_handling}, ${+ebay_collected_tax}, ${+fv_fixed}, ${+fv_variable}, ${+international_fee}, ${+gross_amount}, ${+net_amount})
            `;
        }

        // Revalidate the cache for the sales page and redirect the user
        // Assuming revalidatePath and redirect are available in your application context
        revalidatePath('/dashboard/sales');
        redirect('/dashboard/sales');

        return {
            message: 'Sales uploaded successfully',
        };
    } catch (error) {
        console.error('Error inserting sales data:', error);
        return {
            message: 'Database Error: Failed to upload sales.',
        };
    }
}