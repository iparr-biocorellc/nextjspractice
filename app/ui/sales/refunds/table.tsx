import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchRefunds } from '@/app/lib/data'; // This should be your actual function to fetch refunds
import { UpdateRefund, DeleteRefund } from '@/app/ui/sales/buttons'; // Adjust if you have similar components for refunds

export default async function RefundsTable({
                                             order_number,
                                           }: {
  order_number: string;
}) {
  const refunds = await fetchRefunds(order_number); // Adjust to your actual function to fetch refunds
  return (
      <div className="mt-6 flow-root overflow-scroll" style={{ maxHeight: "800px" }}>
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-x-auto rounded-lg bg-gray-50 p-2 md:pt-0">
            <table className="min-w-full divide-y divide-gray-200 text-gray-900" style={{ whiteSpace: "nowrap" }}>
              <thead className="bg-gray-50 text-left text-sm font-semibold">
              <tr>
                {/* Headers for refund columns */}
                <th scope="col" className="px-3 py-3">ID</th>
                <th scope="col" className="px-3 py-3">Gross Amount</th>
                <th scope="col" className="px-3 py-3">Refund Type</th>
                <th scope="col" className="px-3 py-3">Fixed Credit</th>
                <th scope="col" className="px-3 py-3">Variable Credit</th>
                <th scope="col" className="px-3 py-3">Tax Refunded</th>
                <th scope="col" className="px-3 py-3">Net Amount</th>
                <th scope="col" className="px-3 py-3">Date</th>
                {/* Actions column if necessary */}
                <th scope="col" className="px-3 py-3">Actions</th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {refunds?.map((refund) => (
                  <tr key={refund.id}>
                    {/* Data for all columns */}
                    <td className="px-3 py-1">{refund.id}</td>
                    <td className="px-3 py-1">{formatCurrency(refund.gross_amount)}</td>
                    <td className="px-3 py-1">{refund.refund_type}</td>
                    <td className="px-3 py-1">{formatCurrency(refund.fv_fixed_credit)}</td>
                    <td className="px-3 py-1">{formatCurrency(refund.fv_variable_credit)}</td>
                    <td className="px-3 py-1">{formatCurrency(refund.ebay_tax_refunded)}</td>
                    <td className="px-3 py-1">{formatCurrency(refund.net_amount)}</td>
                    <td className="px-3 py-1">{formatDateToLocal(refund.date)}</td>
                    {/* Add action buttons if you have them */}
                    <td>
                      <div className="flex justify-end gap-3">
                        {/* Adjust these components to match actions for refunds */}
                        <UpdateRefund order_number={order_number} id={refund.id} />
                        <DeleteRefund id={refund.id} />
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
