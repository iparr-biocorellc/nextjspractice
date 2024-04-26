import Form from '@/app/ui/sales/refunds/refund-form';
import Breadcrumbs from '@/app/ui/sales/breadcrumbs';

export default async function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Sales', href: '/dashboard/sales' },
                    {
                        label: 'Upload Refunds',
                        href: '/dashboard/sales/upload/refunds',
                        active: true,
                    },
                ]}
            />
            <Form/>
        </main>
    );
}