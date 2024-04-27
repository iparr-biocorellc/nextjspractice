import Table from '@/app/ui/sales/purchases/table';
import Form from '@/app/ui/sales/purchases/create-form';
import {fetchAllPurchasesWithCostOutstanding} from '@/app/lib/data';
import Breadcrumbs from "@/app/ui/purchases/breadcrumbs";

export default async function Page(
    { params }: { params: { order_number: string } }
) {
    const order_number = params.order_number;
    const purchases = await fetchAllPurchasesWithCostOutstanding();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Sales', href: '/dashboard/sales'},
                    {
                        label: 'Upload Purchase Orders',
                        href: '/dashboard/sales/purchase-cost',
                        active: true,
                    },
                ]}
            />
            <div className="w-full">
                <Table order_number={order_number}/>

            </div>
            <Form order_number={order_number} purchases={purchases}/>
        </main>
    );
}
