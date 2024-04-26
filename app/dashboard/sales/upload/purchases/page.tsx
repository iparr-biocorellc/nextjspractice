import Form from '@/app/ui/sales/purchases/purchase-form';
import Breadcrumbs from '@/app/ui/sales/breadcrumbs';

export default async function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Sales', href: '/dashboard/sales' },
                    {
                        label: 'Upload Purchases',
                        href: '/dashboard/sales/upload/purchases',
                        active: true,
                    },
                ]}
            />
            <Form/>
        </main>
    );
}