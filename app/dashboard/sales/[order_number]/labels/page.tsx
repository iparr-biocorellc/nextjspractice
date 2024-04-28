import Table from '@/app/ui/sales/labels/table';
import Form from '@/app/ui/sales/labels/create-form';
import Breadcrumbs from "@/app/ui/purchases/breadcrumbs";

export default async function Page(
    { params }: { params: { order_number: string } }
) {
    const order_number = params.order_number;
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Sales', href: '/dashboard/sales'},
                    {
                        label: 'Update Labels',
                        href: '/dashboard/sales/labels',
                        active: true,
                    },
                ]}
            />
            <div className="w-full">
                <Table order_number={order_number}/>

            </div>
            <Form order_number={order_number}/>
        </main>
    );
}
