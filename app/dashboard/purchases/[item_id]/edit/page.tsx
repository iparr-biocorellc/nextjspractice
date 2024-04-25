import Form from '@/app/ui/sales/edit-form';
import Breadcrumbs from '@/app/ui/sales/breadcrumbs';
import { fetchOrderByOrderNumber, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';



export default async function Page({ params }: { params: { order_number: string } }) {
    const order_number = params.order_number;
    const [order, customers] = await Promise.all([
        fetchOrderByOrderNumber(order_number),
        fetchCustomers(),
    ]);
    if (!order) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Sales', href: '/dashboard/sales' },
                    {
                        label: 'Edit Order',
                        href: `/dashboard/sales/${order_number}/edit`,
                        active: true,
                    },
                ]}
            />
            {/*<Form order={order} customers={customers} />*/}
        </main>
    );
}