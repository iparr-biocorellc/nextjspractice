import Form from '@/app/ui/sales/create-form';
import Breadcrumbs from '@/app/ui/sales/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';

export default async function Page() {
    const customers = await fetchCustomers();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Sales', href: '/dashboard/sales' },
                    {
                        label: 'Upload Sales',
                        href: '/dashboard/sales/upload',
                        active: true,
                    },
                ]}
            />
            <Form/>
        </main>
    );
}