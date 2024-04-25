import Form from '@/app/ui/purchases/create-form';
import Breadcrumbs from '@/app/ui/purchases/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';

export default async function Page() {
    const customers = await fetchCustomers();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Purchases', href: '/dashboard/purchases' },
                    {
                        label: 'Upload Purchases',
                        href: '/dashboard/purchases/upload',
                        active: true,
                    },
                ]}
            />
            <Form/>
        </main>
    );
}