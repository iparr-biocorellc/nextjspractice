import Form from '@/app/ui/sales/labels/label-form';
import Breadcrumbs from '@/app/ui/sales/breadcrumbs';

export default async function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Sales', href: '/dashboard/sales' },
                    {
                        label: 'Upload Labels',
                        href: '/dashboard/sales/upload/labels',
                        active: true,
                    },
                ]}
            />
            <Form/>
        </main>
    );
}