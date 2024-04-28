import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchLabels } from '@/app/lib/data'; // This should be your actual function to fetch label orders
import { UpdateLabel, DeleteLabel } from '@/app/ui/sales/buttons'; // These should be your actual button components for label orders

export default async function LabelsTable({
  order_number,
}: {
  order_number: string;
}) {
  const labelOrders = await fetchLabels(order_number); // This should be your actual function to fetch label orders
  return (
      <div className="mt-6 flow-root overflow-scroll" style={{ maxHeight: "800px" }}>
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-x-auto rounded-lg bg-gray-50 p-2 md:pt-0">
            <table className="min-w-full divide-y divide-gray-200 text-gray-900" style={{ whiteSpace: "nowrap" }}>
              <thead className="bg-gray-50 text-left text-sm font-semibold">
              <tr>
                {/* Update headers for all columns to match the labels table */}
                <th scope="col" className="px-3 py-3">Tracking Number</th>
                <th scope="col" className="px-3 py-3">Shipping Service</th>
                <th scope="col" className="px-3 py-3">Cost</th>
                <th scope="col" className="px-3 py-3">Date</th>
                <th scope="col" className="px-3 py-3">Buyer Username</th>
                <th scope="col" className="px-3 py-3">Notes</th>
                {/* Actions column if necessary */}
                <th scope="col" className="px-3 py-3">Actions</th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {labelOrders?.map((labelOrder) => (
                  <tr key={labelOrder.tracking_number}>
                    {/* Data for all columns */}
                    <td className="px-3 py-1">{labelOrder.tracking_number}</td>
                    <td className="px-3 py-1">{labelOrder.shipping_service}</td>
                    <td className="px-3 py-1">{formatCurrency(labelOrder.cost)}</td>
                    <td className="px-3 py-1">{formatDateToLocal(labelOrder.date)}</td>
                    <td className="px-3 py-1">{labelOrder.buyer_username}</td>
                    <td className="px-3 py-1">{labelOrder.notes}</td>
                    {/* Add action buttons if you have them */}
                    <td>
                      <div className="flex justify-end gap-3">
                        {/* Update these components to match actions for label orders */}
                        <UpdateLabel order_number={order_number} tracking_number={labelOrder.tracking_number} />
                        <DeleteLabel tracking_number={labelOrder.tracking_number} />
                      </div>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}
