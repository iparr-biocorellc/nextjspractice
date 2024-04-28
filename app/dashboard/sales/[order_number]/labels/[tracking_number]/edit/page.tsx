import Form from '@/app/ui/sales/labels/edit-form';
import Breadcrumbs from '@/app/ui/sales/breadcrumbs';
import {fetchLabelByID} from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { order_number: string, tracking_number: string } }) {
    const order_number = params.order_number;
    const tracking_number = params.tracking_number;
    const [label] = await Promise.all([
        fetchLabelByID(tracking_number),
    ]);
    if (!label) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Orders', href: '/dashboard/sales' },
                    {
                        label: 'Edit Label',
                        href: `/dashboard/sales/${order_number}/labels/${tracking_number}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form order_number={order_number} tracking_number={tracking_number} label={label} />
        </main>
    );
}