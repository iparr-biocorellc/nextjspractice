import Form from '@/app/ui/sales/refunds/edit-form';
import Breadcrumbs from '@/app/ui/sales/breadcrumbs';
import { fetchRefundByID } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { order_number: string, id: number } }) {
    const order_number = params.order_number;
    const id = params.id;
    const [refund] = await Promise.all([
        fetchRefundByID(id),
    ]);
    if (!refund) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Orders', href: '/dashboard/sales' },
                    {
                        label: 'Edit Refund',
                        href: `/dashboard/sales/${order_number}/refunds/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form order_number={order_number} id={id} refund={refund} />
        </main>
    );
}
