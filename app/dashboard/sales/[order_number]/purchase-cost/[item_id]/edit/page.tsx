import Form from '@/app/ui/sales/purchases/edit-form';
import Breadcrumbs from '@/app/ui/sales/breadcrumbs';
import {fetchPurchaseWithCostsByItemID, fetchPurchaseOrderByID} from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { order_number: string, item_id: string } }) {
    const order_number = params.order_number;
    const item_id = params.item_id;
    const [purchase] = await Promise.all([
        fetchPurchaseWithCostsByItemID(item_id),
    ]);
    const [purchaseOrder] = await Promise.all([
        fetchPurchaseOrderByID(order_number, item_id),
    ]);
    if (!purchase) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Orders', href: '/dashboard/sales' },
                    {
                        label: 'Edit Purchase Order',
                        href: `/dashboard/sales/${order_number}/purchase-cost/${item_id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form order_number={order_number} item_id={item_id} purchase={purchase} respective_cost={purchaseOrder.respective_cost}/>
        </main>
    );
}