import Table from '@/app/ui/sales/purchases/table';
import Form from '@/app/ui/sales/purchases/create-form';
import {fetchAllPurchasesWithCostOutstanding} from '@/app/lib/data';

export default async function Page(
    { params }: { params: { order_number: string } }
) {
    const order_number = params.order_number;
    const purchases = await fetchAllPurchasesWithCostOutstanding();

    return (
        <div className="w-full">
            <Table order_number={order_number} />
            <Form order_number={order_number} purchases={purchases} />
        </div>
    );
}
