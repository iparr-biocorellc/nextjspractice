import Form from '@/app/ui/expenses/subscriptions/edit-form';
import Breadcrumbs from '@/app/ui/expenses/breadcrumbs';
import { fetchSubscriptionByID } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: number } }) {
    const id = params.id;
    const [subscription] = await Promise.all([
        fetchSubscriptionByID(id),
    ]);
    if (!subscription) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Expenses', href: '/dashboard/expenses' },
                    {
                        label: 'Edit Subscription',
                        href: `/dashboard/expenses/subscriptions/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form subscription={subscription}/>
        </main>
    );
}