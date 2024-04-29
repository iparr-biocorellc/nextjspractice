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
    date: z.string({
        invalid_type_error: 'Please enter a valid date.',
    }),
    item_title: z.string({
        invalid_type_error: 'Please enter a valid item title.',
    }),
    item_id: z.string({
        invalid_type_error: 'Please enter a valid item ID.',
    }),
    buyer_username: z.string({
        invalid_type_error: 'Please enter a valid buyer username.',
    }),
    buyer_name: z.string({
        invalid_type_error: 'Please enter a valid buyer name.',
    }),
    city: z.string({
        invalid_type_error: 'Please enter a valid city.',
    }),
    state: z.string({
        invalid_type_error: 'Please enter a valid state.',
    }),
    zip: z.string({
        invalid_type_error: 'Please enter a valid ZIP code.',
    }),
    quantity: z.number({
        invalid_type_error: 'Please enter a valid quantity.',
    }),
    item_subtotal: z.number({
        invalid_type_error: 'Please enter a valid item subtotal.',
    }),
    shipping_handling: z.number({
        invalid_type_error: 'Please enter a valid shipping and handling cost.',
    }),
    ebay_collected_tax: z.number({
        invalid_type_error: 'Please enter a valid eBay collected tax.',
    }),
    fv_fixed: z.number({
        invalid_type_error: 'Please enter a valid fixed final value fee.',
    }),
    fv_variable: z.number({
        invalid_type_error: 'Please enter a valid variable final value fee.',
    }),
    international_fee: z.number({
        invalid_type_error: 'Please enter a valid international fee.',
    }),
    gross_amount: z.number({
        invalid_type_error: 'Please enter a valid gross amount.',
    }),
    net_amount: z.number({
        invalid_type_error: 'Please enter a valid net amount.',
    }),
});
const LinkPurchaseData = z.object({
    item_id: z.string({
        invalid_type_error: 'Please enter a valid item ID.',
    }),
    order_number: z.string({
        invalid_type_error: 'Please enter a valid order number.',
    }),
    respective_cost: z.number({
        invalid_type_error: 'Please enter a valid respective cost.',
    }),
});
export type LinkPurchaseState = {
    errors?: {
        item_id?: string[];
        order_number?: string[];
        respective_cost?: string[];
    };
    message?: string | null;
};

const RefundData = z.object({
    id: z.number({
        invalid_type_error: 'Please enter a valid refund ID.',
    }),
    gross_amount: z.number({
        invalid_type_error: 'Please enter a valid gross amount.',
    }),
    refund_type: z.string({
        invalid_type_error: 'Please select a refund type.',
    }),
    fv_fixed_credit: z.number({
        invalid_type_error: 'Please enter a valid fixed credit amount.',
    }),
    fv_variable_credit: z.number({
        invalid_type_error: 'Please enter a valid variable credit amount.',
    }),
    ebay_tax_refunded: z.number({
        invalid_type_error: 'Please enter a valid eBay tax refunded amount.',
    }),
    net_amount: z.number({
        invalid_type_error: 'Please enter a valid net amount.',
    }),
    date: z.string({
        invalid_type_error: 'Please enter a valid date.',
    }),
    order_number: z.string({
        invalid_type_error: 'Please enter a valid order number.',
    }),
});
export type RefundState = {
    errors?: {
        id?: string[];
        gross_amount?: string[];
        refund_type?: string[];
        fv_fixed_credit?: string[];
        fv_variable_credit?: string[];
        ebay_tax_refunded?: string[];
        net_amount?: string[];
        date?: string[];
        order_number?: string[];
    };
    message?: string | null;
};

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
    date: z.string({
        invalid_type_error: 'Please enter a valid date.',
    }),
    platform: z.string({
        invalid_type_error: 'Please enter a valid platform.',
    }),
    seller_username: z.string({
        invalid_type_error: 'Please enter a valid seller username.',
    }),
    listing_title: z.string({
        invalid_type_error: 'Please enter a valid listing title.',
    }),
    individual_price: z.number(
        {
            invalid_type_error: 'Please enter a valid individual price.',
        }
    ),
    quantity: z.number({
        invalid_type_error: 'Please enter a valid quantity.',
    }),
    shipping_price: z.number({
        invalid_type_error: 'Please enter a valid shipping price.',
    }),
    tax: z.number({
        invalid_type_error: 'Please enter a valid tax.',
    }),
    total: z.number({
        invalid_type_error: 'Please enter a valid total.',
    }),
    amount_refunded: z.number({
        invalid_type_error: 'Please enter a valid amount refunded.',
    }),
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

const PurchaseOrderData = z.object({
    order_number: z.string({
        invalid_type_error: 'Please enter a valid order number.',
    }),
    item_id: z.string({
        invalid_type_error: 'Please enter a valid item ID.',
    }),
    respective_cost: z.number().nonnegative({
        message: "Respective cost must be a non-negative number."
    }),
});

export type PurchaseOrderState = {
    errors?: {
        order_number?: string[];
        item_id?: string[];
        respective_cost?: string[];
    };
    message?: string | null;
};

const LabelData = z.object({
    tracking_number: z.string({
        invalid_type_error: 'Please enter a valid tracking number.',
    }),
    shipping_service: z.string({
        invalid_type_error: 'Please enter a valid shipping service.',
    }),
    cost: z.number({
        invalid_type_error: 'Please enter a valid cost.',
    }),
    date: z.string({
        invalid_type_error: 'Please enter a valid date.',
    }), // Assuming date comes from the Excel data as a serial date number
    buyer_username: z.string({
        invalid_type_error: 'Please enter a valid buyer username.',
    }),
    notes: z.string().optional(), // Making it optional in case it's not provided in the Excel
    order_number: z.string({
        invalid_type_error: 'Please enter a valid order number.',
    }),
});
export type LabelState = {
    errors?: {
        tracking_number?: string[];
        shipping_service?: string[];
        cost?: string[];
        date?: string[];
        buyer_username?: string[];
        notes?: string[];
        order_number?: string[];
    };
    message?: string | null;
};


const CreateInvoice = FormSchema.omit({ id: true, date: true });
const CreatePurchaseOrder = PurchaseOrderData;
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const UpdatePurchase = PurchaseData.omit({ item_id: true });
const UpdateOrder = OrderData.omit({ order_number: true });
const UpdateLabel = LabelData.omit({ tracking_number: true, order_number: true });
const UpdateRefund = RefundData.omit({ id: true, order_number: true });
export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};


export async function createPurchaseOrder(prevState: PurchaseOrderState, formData: FormData) {
    // Validate form using Zod
    const validatedFields = CreatePurchaseOrder.safeParse({
        order_number: formData.get('order_number'),
        item_id: formData.get('item_id'),
        respective_cost: parseFloat(formData.get('respective_cost') as string),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing or invalid fields. Failed to create purchase order.',
        };
    }

    const { order_number, item_id, respective_cost } = validatedFields.data;

    try {
        await sql`
            INSERT INTO purchase_orders (order_number, item_id, respective_cost)
            VALUES (${order_number}, ${item_id}, ${respective_cost})
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to create purchase order.',
        };
    }

    // Depending on your application's logic you might need to revalidate the cache
    // and redirect or simply return success message.
    // e.g., if you use SWR and need to revalidate the data
    // swr.revalidate('/api/purchase-orders');
    // return { message: 'Purchase order created successfully.' };
    revalidatePath(`/dashboard/sales/${order_number}/purchase-cost`);
    redirect(`/dashboard/sales/${order_number}/purchase-cost`);
}

export async function createLabel(prevState: LabelState, formData: FormData) {
    const validatedFields = LabelData.safeParse({
        tracking_number: formData.get('tracking_number'),
        shipping_service: formData.get('shipping_service'),
        cost: parseFloat(formData.get('cost') as string),
        date: formData.get('date'),
        buyer_username: formData.get('buyer_username'),
        notes: formData.get('notes'),
        order_number: formData.get('order_number'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing or invalid fields. Failed to create label.',
        };
    }

    const { tracking_number, shipping_service, cost, date, buyer_username, notes, order_number } = validatedFields.data;

    try {
        // Start a transaction
        await sql`BEGIN`;

        // Insert into the labels table
        await sql`
        INSERT INTO labels (tracking_number, shipping_service, cost, date, buyer_username, notes)
        VALUES (${tracking_number}, ${shipping_service}, ${cost}, ${date}, ${buyer_username}, ${notes})
    `;

        // Insert into the label_orders table
        await sql`
        INSERT INTO label_orders (order_number, tracking_number)
        VALUES (${order_number}, ${tracking_number})
    `;

        // Commit the transaction
        await sql`COMMIT`;
    } catch (error) {
        // If there's an error, neither insert will take place
        await sql`ROLLBACK`;
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to create label.',
        };
    }
    // If everything is successful, redirect
    revalidatePath(`/dashboard/sales/${order_number}/labels`);
    redirect(`/dashboard/sales/${order_number}/labels`);
}

export async function createRefund(prevState: RefundState, formData: FormData) {
    const validatedFields = RefundData.safeParse({
        id: parseInt(formData.get('id') as string),
        gross_amount: parseFloat(formData.get('gross_amount') as string),
        refund_type: formData.get('refund_type'),
        fv_fixed_credit: parseFloat(formData.get('fv_fixed_credit') as string),
        fv_variable_credit: parseFloat(formData.get('fv_variable_credit') as string),
        ebay_tax_refunded: parseFloat(formData.get('ebay_tax_refunded') as string),
        net_amount: parseFloat(formData.get('net_amount') as string),
        date: formData.get('date'),
        order_number: formData.get('order_number'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing or invalid fields. Failed to create refund.',
        };
    }

    const { id, gross_amount, refund_type, fv_fixed_credit, fv_variable_credit, ebay_tax_refunded, net_amount, date, order_number } = validatedFields.data;

    try {
        // Start a transaction
        await sql`BEGIN`;

        // Insert into the refunds table
        await sql`
        INSERT INTO refunds (id, gross_amount, refund_type, fv_fixed_credit, fv_variable_credit, ebay_tax_refunded, net_amount, date)
        VALUES (${id}, ${gross_amount}, ${refund_type}, ${fv_fixed_credit}, ${fv_variable_credit}, ${ebay_tax_refunded}, ${net_amount}, ${date})
    `;

        // Insert into the refund_orders table
        await sql`
        INSERT INTO refund_orders (order_number, refund_id)
        VALUES (${order_number}, ${id})
    `;

        // Commit the transaction
        await sql`COMMIT`;
    } catch (error) {
        // If there's an error, neither insert will take place
        await sql`ROLLBACK`;
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to create refund.',
        };
    }

    // If everything is successful, redirect
    revalidatePath(`/dashboard/sales/${order_number}/refunds`);
    redirect(`/dashboard/sales/${order_number}/refunds`);
}

export async function updatePurchase(
    item_id: string,
    prevState: any,  // Define this type according to your state management
    formData: FormData,
) {
    const validatedFields = UpdatePurchase.safeParse({
        item_id: formData.get('item_id'),
        date: formData.get('date'),
        platform: formData.get('platform'),
        seller_username: formData.get('seller_username'),
        listing_title: formData.get('listing_title'),
        individual_price: parseFloat(formData.get('individual_price') as string),
        quantity: parseInt(formData.get('quantity') as string),
        shipping_price: parseFloat(formData.get('shipping_price') as string),
        tax: parseFloat(formData.get('tax') as string),
        total: parseFloat(formData.get('total') as string),
        amount_refunded: parseFloat(formData.get('amount_refunded') as string),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Purchase.',
        };
    }

    const { date, platform, seller_username, listing_title, individual_price, quantity, shipping_price, tax, total, amount_refunded } = validatedFields.data;

    try {
        await sql`
      UPDATE purchases
      SET date = ${date}, platform = ${platform}, seller_username = ${seller_username}, listing_title = ${listing_title},
          individual_price = ${individual_price}, quantity = ${quantity}, shipping_price = ${shipping_price}, 
          tax = ${tax}, total = ${total}, amount_refunded = ${amount_refunded}
      WHERE item_id = ${item_id}
    `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update Purchase.' };
    }

    revalidatePath('/dashboard/purchases');
    redirect('/dashboard/purchases');
}

export async function updateOrder(
    order_number: string,
    prevState: any, // Define this type according to your state management
    formData: FormData,
) {
    const validatedFields = UpdateOrder.safeParse({
        order_number: formData.get('order_number'),
        date: formData.get('date'),
        item_title: formData.get('item_title'),
        item_id: formData.get('item_id'),
        buyer_username: formData.get('buyer_username'),
        buyer_name: formData.get('buyer_name'),
        city: formData.get('city'),
        state: formData.get('state'),
        zip: formData.get('zip'),
        quantity: parseInt(formData.get('quantity') as string),
        item_subtotal: parseFloat(formData.get('item_subtotal') as string),
        shipping_handling: parseFloat(formData.get('shipping_handling') as string),
        ebay_collected_tax: parseFloat(formData.get('ebay_collected_tax') as string),
        fv_fixed: parseFloat(formData.get('fv_fixed') as string),
        fv_variable: parseFloat(formData.get('fv_variable') as string),
        international_fee: parseFloat(formData.get('international_fee') as string),
        gross_amount: parseFloat(formData.get('gross_amount') as string),
        net_amount: parseFloat(formData.get('net_amount') as string),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing or Invalid Fields. Failed to Update Order.',
        };
    }

    const { date, item_title, item_id, buyer_username, buyer_name, city, state, zip, quantity, item_subtotal, shipping_handling, ebay_collected_tax, fv_fixed, fv_variable, international_fee, gross_amount, net_amount } = validatedFields.data;

    try {
        await sql`
            UPDATE orders
            SET 
                date = ${date}, item_title = ${item_title}, item_id = ${item_id},
                buyer_username = ${buyer_username}, buyer_name = ${buyer_name}, city = ${city},
                state = ${state}, zip = ${zip}, quantity = ${quantity}, item_subtotal = ${item_subtotal},
                shipping_handling = ${shipping_handling}, ebay_collected_tax = ${ebay_collected_tax},
                fv_fixed = ${fv_fixed}, fv_variable = ${fv_variable}, international_fee = ${international_fee},
                gross_amount = ${gross_amount}, net_amount = ${net_amount}
            WHERE order_number = ${order_number}
        `;
    } catch (error) {
        console.error(error);
        return { message: 'Database Error: Failed to Update Order.' };
    }

    // Your revalidatePath and redirect functions will be called here, ensure they're defined
    revalidatePath('/dashboard/sales');
    redirect('/dashboard/sales');
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

export async function deleteSubscription(id: number) {
    try {
        await sql`DELETE FROM subscriptions WHERE id = ${id}`;
        revalidatePath('/dashboard/expenses/subscriptions');
        return { message: 'Deleted Subscription.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Subscription.' };
    }
}

export async function deleteConsumable(id: number) {
    try {
        await sql`DELETE FROM consumables WHERE id = ${id}`;
        revalidatePath('/dashboard/expenses/consumables');
        return { message: 'Deleted Consumable.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Consumable.' };
    }
}

export async function deletePurchaseOrder(order_number: string, item_id: string) {
    try {
        await sql`DELETE FROM purchase_orders WHERE order_number = ${order_number} AND item_id = ${item_id}`;
        revalidatePath(`/dashboard/sales/${order_number}/purchase-cost`);
        return { message: 'Deleted Purchase Order.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Purchase Order.' };
    }
}

export async function deleteLabel(tracking_number: string) {
    try {
        // Start a transaction
        await sql`BEGIN`;

        // First delete the label from the label_orders table
        await sql`DELETE FROM label_orders WHERE tracking_number = ${tracking_number}`;

        // Then delete the label from the labels table
        await sql`DELETE FROM labels WHERE tracking_number = ${tracking_number}`;

        // If everything was successful, commit the transaction
        await sql`COMMIT`;
        revalidatePath('/dashboard/sales/labels')
        return { message: 'Label successfully deleted.' };
    } catch (error) {
        console.error('Database Error:', error);
        // Attempt to rollback in case of an error
        await sql`ROLLBACK;`;
        return { message: 'Database Error: Failed to delete label.' };
    }
}

export async function deleteRefund(refundId: number) {
    try {
        // Start a transaction
        await sql`BEGIN`;

        // First delete any linked entries in the refund_orders table
        await sql`DELETE FROM refund_orders WHERE refund_id = ${refundId}`;

        // Then delete the refund from the refunds table
        await sql`DELETE FROM refunds WHERE id = ${refundId}`;

        // If everything was successful, commit the transaction
        await sql`COMMIT`;
        revalidatePath('/dashboard/sales/refunds')

        // Return a success message or handle the success case as needed (e.g., redirect to a confirmation page)
        return { message: 'Refund successfully deleted.' };
    } catch (error) {
        console.error('Database Error:', error);
        // Attempt to rollback in case of an error
        await sql`ROLLBACK;`;
        return { message: 'Database Error: Failed to delete refund.' };
    }
}


export async function updateLabel(
    tracking_number: string,
    order_number: string,
    prevState: LabelState,
    formData: FormData,
) {
    const validatedFields = UpdateLabel.safeParse({
        shipping_service: formData.get('shipping_service'),
        cost: parseFloat(formData.get('cost') as string),
        date: formData.get('date'),
        buyer_username: formData.get('buyer_username'),
        notes: formData.get('notes'),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing or invalid fields. Failed to update label.',
        };
    }

    const { shipping_service, cost, date, buyer_username, notes } = validatedFields.data;

    try {
        await sql`
        UPDATE labels
        SET shipping_service = ${shipping_service}, cost = ${cost}, date = ${date}, buyer_username = ${buyer_username}, notes = ${notes}
        WHERE tracking_number = ${tracking_number}
    `;
    } catch (error) {
        // If there's an error, neither update will take place
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to update label.',
        };
    }

    // If everything is successful, redirect
    revalidatePath(`/dashboard/sales/${order_number}/labels`);
    redirect(`/dashboard/sales/${order_number}/labels`);
}

export async function updateRefund(
    refundId: number,
    order_number: string,
    prevState: RefundState,
    formData: FormData,
) {
    const validatedFields = UpdateRefund.safeParse({
        gross_amount: parseFloat(formData.get('gross_amount') as string),
        refund_type: formData.get('refund_type'),
        fv_fixed_credit: parseFloat(formData.get('fv_fixed_credit') as string),
        fv_variable_credit: parseFloat(formData.get('fv_variable_credit') as string),
        ebay_tax_refunded: parseFloat(formData.get('ebay_tax_refunded') as string),
        net_amount: parseFloat(formData.get('net_amount') as string),
        date: formData.get('date'),
    });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing or invalid fields. Failed to update refund.',
        };
    }

    const { gross_amount, refund_type, fv_fixed_credit, fv_variable_credit, ebay_tax_refunded, net_amount, date} = validatedFields.data;

    try {
        // Start a transaction
        await sql`BEGIN`;

        // Update the refunds table
        await sql`
        UPDATE refunds
        SET gross_amount = ${gross_amount}, refund_type = ${refund_type}, fv_fixed_credit = ${fv_fixed_credit},
            fv_variable_credit = ${fv_variable_credit}, ebay_tax_refunded = ${ebay_tax_refunded}, net_amount = ${net_amount},
            date = ${date}
        WHERE id = ${refundId}
    `;

        // Update the refund_orders table
        await sql`
        UPDATE refund_orders
        SET order_number = ${order_number}
        WHERE refund_id = ${refundId}
    `;

        // Commit the transaction
        await sql`COMMIT`;
    } catch (error) {
        // If there's an error, neither update will take place
        await sql`ROLLBACK`;
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to update refund.',
        };
    }

    // If everything is successful, redirect
    revalidatePath(`/dashboard/sales/${order_number}/refunds`);
    redirect(`/dashboard/sales/${order_number}/refunds`);
}

export async function updatePurchaseOrder(
    order_number: string,
    item_id: string,
    prevState: any,
    formData: FormData,
) {
    const validatedFields = PurchaseOrderData.safeParse({
        order_number: order_number,
        item_id: item_id,
        respective_cost: parseFloat(formData.get('respective_cost') as string),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing or invalid fields. Failed to update purchase order.',
        };
    }

    const { respective_cost } = validatedFields.data;

    try {
        await sql`
            UPDATE purchase_orders
            SET respective_cost = ${respective_cost}
            WHERE order_number = ${order_number} AND item_id = ${item_id}
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to update purchase order.',
        };
    }

    revalidatePath(`/dashboard/sales/${order_number}/purchase-cost`);
    redirect(`/dashboard/sales/${order_number}/purchase-cost`);
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
            item_id: String(row.item_id),
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

export async function uploadRefunds(refundsData: any[]): Promise<RefundState> {
    refundsData = refundsData.map((row: any) => {
        // Convert Excel date serial number to JavaScript Date object if necessary
        const date = excelSerialDateToDate(row.date);
        const formattedDate = date.toISOString().split('T')[0];

        return {
            ...row,
            date: formattedDate,
        };
    });

    try {
        // Start a transaction if your SQL library supports it
        await sql`BEGIN`;

        for (const refund of refundsData) {
            const parsedRefund = RefundData.parse(refund);

            // Insert into refunds and get the inserted [id] if it's auto-generated
            const refundResult = await sql`
        INSERT INTO refunds (
          id, gross_amount, refund_type, fv_fixed_credit, fv_variable_credit,
          ebay_tax_refunded, net_amount, date
        ) VALUES (
          ${parsedRefund.id}, ${parsedRefund.gross_amount}, ${parsedRefund.refund_type}, 
          ${parsedRefund.fv_fixed_credit}, ${parsedRefund.fv_variable_credit}, 
          ${parsedRefund.ebay_tax_refunded}, ${parsedRefund.net_amount}, 
          ${parsedRefund.date}
        ) RETURNING id
      `;

            // Extract the generated [id]
            const refundId = refundResult.rows[0].id;

            // Insert into refund_orders
            await sql`
        INSERT INTO refund_orders (refund_id, order_number) VALUES (
          ${refundId}, ${parsedRefund.order_number}
        )
      `;
        }

        // Commit the transaction if everything was successful
        await sql`COMMIT`;

        return { message: 'Successfully uploaded refund data and associated order numbers.' };
    } catch (error) {
        // Rollback the transaction in case of an error
        await sql`ROLLBACK`;

        console.error('Failed to upload refund data:', error);
        if (error instanceof z.ZodError) {
            // Convert the ZodError into your error format
            const fieldErrors = error.flatten().fieldErrors;
            let errors: any = {};
            for (const key of Object.keys(fieldErrors)) {
                errors[key] = fieldErrors[key];
            }
            return { message: 'Failed to upload refund data.', errors };
        } else {
            // Handle non-validation errors
            return { message: `Database Error: ${(error as Error).message ?? 'An unknown error occurred.'}` };
        }
    }
}

export async function uploadLabels(labelsData: any[]): Promise<LabelState> {
    labelsData = labelsData.map((row: any) => {
        // Convert Excel date serial number to JavaScript Date object if necessary
        const date = excelSerialDateToDate(row.date);
        const formattedDate = date.toISOString().split('T')[0];

        return {
            ...row,
            tracking_number: String(row.tracking_number),
            date: formattedDate,
        };
    });

    try {
        // Start a transaction if your SQL library supports it
        await sql`BEGIN`;

        for (const label of labelsData) {
            const parsedLabel = LabelData.parse(label);

            // Insert into labels
            await sql`
        INSERT INTO labels (
          tracking_number, shipping_service, cost, date, buyer_username, notes
        ) VALUES (
          ${parsedLabel.tracking_number}, ${parsedLabel.shipping_service},
          ${parsedLabel.cost}, ${parsedLabel.date}, ${parsedLabel.buyer_username},
          ${parsedLabel.notes}
        )
      `;

            // Assuming that tracking_number is unique and can be used to link the label to an order
            // Insert into label_orders
            await sql`
        INSERT INTO label_orders (tracking_number, order_number) VALUES (
          ${parsedLabel.tracking_number}, ${parsedLabel.order_number}
        )
      `;
        }

        // Commit the transaction if everything was successful
        await sql`COMMIT`;

        return { message: 'Successfully uploaded label data.' };
    } catch (error) {
        // Rollback the transaction in case of an error
        await sql`ROLLBACK`;

        console.error('Failed to upload label data:', error);
        if (error instanceof z.ZodError) {
            // Convert the ZodError into your error format
            const fieldErrors = error.flatten().fieldErrors;
            let errors: any = {};
            for (const key of Object.keys(fieldErrors)) {
                errors[key] = fieldErrors[key];
            }
            return { message: 'Failed to upload label data.', errors };
        } else {
            // Handle non-validation errors
            return { message: `Database Error: ${(error as Error).message ?? 'An unknown error occurred.'}` };
        }
    }
}

export async function linkPurchases(purchaseOrdersData: any[]): Promise<LinkPurchaseState> {
    // Map through each row and construct the data structure expected by Zod schema
    purchaseOrdersData = purchaseOrdersData.map((row: any) => ({
        item_id: String(row.item_id), // Assuming item_id is in the correct format
        order_number: String(row.order_number), // Assuming order_number is in the correct format
        respective_cost: Number(row.respective_cost), // Convert to Number in case it's not
    }));

    try {
        await sql`BEGIN`; // Start a transaction

        for (const purchaseOrder of purchaseOrdersData) {
            // Validate the purchase order data
            const parsedPurchaseOrder = LinkPurchaseData.parse(purchaseOrder);

            // Insert into purchase_orders
            await sql`
        INSERT INTO purchase_orders (item_id, order_number, respective_cost) VALUES (
          ${parsedPurchaseOrder.item_id}, 
          ${parsedPurchaseOrder.order_number}, 
          ${parsedPurchaseOrder.respective_cost}
        )
      `;
        }

        await sql`COMMIT`; // Commit the transaction
        return { message: 'Successfully linked purchase order data.' };
    } catch (error) {
        await sql`ROLLBACK`; // Rollback the transaction in case of an error

        console.error('Failed to link purchase order data:', error);
        if (error instanceof z.ZodError) {
            const fieldErrors = error.flatten().fieldErrors;
            let errors: any = {};
            for (const key of Object.keys(fieldErrors)) {
                errors[key] = fieldErrors[key];
            }
            return { message: 'Failed to link purchase order data.', errors };
        } else {
            return { message: `Database Error: ${(error as Error).message ?? 'An unknown error occurred.'}` };
        }
    }
}


