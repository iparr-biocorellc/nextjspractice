import Table from '@/app/ui/sales/purchases/table';

export default async function Page(
    { params }: { params: { order_number: string } }
) {
    const order_number = params.order_number;

    return (
        <div className="w-full">
            <Table order_number={order_number} />
        </div>
    );
}
