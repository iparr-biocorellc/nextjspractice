import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredOrders } from '@/app/lib/data'; // Adjust to fetch orders
import {UpdateOrder, DeleteOrder, UpdatePurchaseCost, UpdateLabelCost, UpdateRefunded} from '@/app/ui/sales/buttons';

export default async function SalesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const orders = await fetchFilteredOrders(query, currentPage);
  return (
      <div className="mt-6 flow-root overflow-scroll" style={{maxHeight: "800px"}}>
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-x-auto rounded-lg bg-gray-50 p-2 md:pt-0">
            <table className="min-w-full divide-y divide-gray-200 text-gray-900" style={{whiteSpace: "nowrap"}}>
              <thead className="bg-gray-50 text-left text-sm font-semibold">
              <tr>
                {/* Headers for all columns */}
                <th scope="col" className="px-3 py-3">Order Number</th>
                <th scope="col" className="px-3 py-3">Date</th>
                <th scope="col" className="px-3 py-3">Item Title</th>
                <th scope="col" className="px-3 py-3">Item ID</th>
                <th scope="col" className="px-3 py-3">Buyer Username</th>
                <th scope="col" className="px-3 py-3">Buyer Name</th>
                <th scope="col" className="px-3 py-3">City</th>
                <th scope="col" className="px-3 py-3">State</th>
                <th scope="col" className="px-3 py-3">Zip</th>
                <th scope="col" className="px-3 py-3">Quantity</th>
                <th scope="col" className="px-3 py-3">Item Subtotal</th>
                <th scope="col" className="px-3 py-3">Shipping & Handling</th>
                <th scope="col" className="px-3 py-3">eBay Collected Tax</th>
                <th scope="col" className="px-3 py-3">FV Fixed</th>
                <th scope="col" className="px-3 py-3">FV Variable</th>
                <th scope="col" className="px-3 py-3">International Fee</th>
                <th scope="col" className="px-3 py-3">Gross Amount</th>
                <th scope="col" className="px-3 py-3">Net Amount</th>
                <th scope="col" className="px-3 py-3">Purchase Cost</th>
                <th scope="col" className="px-3 py-3">Label Cost</th>
                <th scope="col" className="px-3 py-3">Refund</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {orders?.map((order) => (
                  <tr key={order.order_number}>
                    {/* Data for all columns */}
                    <td className="px-3 py-1">{order.order_number}</td>
                    <td className="px-3 py-1">{formatDateToLocal(order.date)}</td>
                    <td className="px-3 py-1">{order.item_title}</td>
                    <td className="px-3 py-1">{order.item_id}</td>
                    <td className="px-3 py-1">{order.buyer_username}</td>
                    <td className="px-3 py-1">{order.buyer_name}</td>
                    <td className="px-3 py-1">{order.city}</td>
                    <td className="px-3 py-1">{order.state}</td>
                    <td className="px-3 py-1">{order.zip}</td>
                    <td className="px-3 py-1">{order.quantity}</td>
                    <td className="px-3 py-1">{formatCurrency(order.item_subtotal)}</td>
                    <td className="px-3 py-1">{formatCurrency(order.shipping_handling)}</td>
                    <td className="px-3 py-1">{formatCurrency(order.ebay_collected_tax)}</td>
                    <td className="px-3 py-1">{formatCurrency(order.fv_fixed)}</td>
                    <td className="px-3 py-1">{formatCurrency(order.fv_variable)}</td>
                    <td className="px-3 py-1">{formatCurrency(order.international_fee)}</td>
                    <td className="px-3 py-1">{formatCurrency(order.gross_amount)}</td>
                    <td className="px-3 py-1">{formatCurrency(order.net_amount)}</td>
                    <td className="">
                      <div className="flex justify-end gap-3">
                        <span className="px-2 py-1">{formatCurrency(order.purchase_cost)}</span>
                        <UpdatePurchaseCost order_number={order.order_number}/>
                      </div>
                    </td>
                    <td className="">
                      <div className="flex justify-end gap-3">
                        <span className="px-2 py-1">{formatCurrency(order.label_cost)}</span>
                        <UpdateLabelCost order_number={order.order_number}/>
                      </div>
                    </td>
                    <td className="">
                      <div className="flex justify-end gap-3">
                        <span className="px-2 py-1">{formatCurrency(order.refunded)}</span>
                        <UpdateRefunded order_number={order.order_number}/>
                      </div>
                    </td>
                    <td className="px-3">
                      <div className="flex justify-end gap-3 px-3">
                        <UpdateOrder order_number={order.order_number}/>
                        <DeleteOrder order_number={order.order_number}/>
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
