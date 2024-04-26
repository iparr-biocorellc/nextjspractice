import Form from '@/app/ui/purchases/edit-form';
import Breadcrumbs from '@/app/ui/purchases/breadcrumbs';
import { fetchPurchaseByItemID } from '@/app/lib/data';
import { notFound } from 'next/navigation';



export default async function Page({ params }: { params: { item_id: string } }) {
    const item_id = params.item_id;
    const [purchase] = await Promise.all([
        fetchPurchaseByItemID(item_id),
    ]);
    if (!purchase) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Purchases', href: '/dashboard/purchases' },
                    {
                        label: 'Edit Purchase',
                        href: `/dashboard/purchases/${item_id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form purchase={purchase}/>
        </main>
    );
}