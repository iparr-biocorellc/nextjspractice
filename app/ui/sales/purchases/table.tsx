import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchPurchaseOrders } from '@/app/lib/data'; // Adjust to fetch orders
import {DeletePurchaseOrder, UpdatePurchaseOrder} from "@/app/ui/sales/buttons";


export default async function PurchaseOrdersTable({
  order_number,
}: {
  order_number: string;
}) {
  const purchaseOrders = await fetchPurchaseOrders(order_number);
  return (
      <div className="mt-6 flow-root overflow-scroll" style={{maxHeight: "800px"}}>
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-x-auto rounded-lg bg-gray-50 p-2 md:pt-0">
            <table className="min-w-full divide-y divide-gray-200 text-gray-900" style={{whiteSpace: "nowrap"}}>
              <thead className="bg-gray-50 text-left text-sm font-semibold">
              <tr>
                {/* Headers for all columns */}
                <th scope="col" className="px-3 py-3">Item ID</th>
                <th scope="col" className="px-3 py-3">Date</th>
                <th scope="col" className="px-3 py-3">Platform</th>
                <th scope="col" className="px-3 py-3">Seller Username</th>
                <th scope="col" className="px-3 py-3">Listing Title</th>
                <th scope="col" className="px-3 py-3">Individual Price</th>
                <th scope="col" className="px-3 py-3">Quantity</th>
                <th scope="col" className="px-3 py-3">Shipping Price</th>
                <th scope="col" className="px-3 py-3">Tax</th>
                <th scope="col" className="px-3 py-3">Total</th>
                <th scope="col" className="px-3 py-3">Respective Cost</th>
                <th scope="col" className="px-3 py-3">Actions</th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {purchaseOrders?.map((purchase) => (
                  <tr key={purchase.item_id}>
                    {/* Data for all columns */}
                    <td className="px-3 py-1">{purchase.item_id}</td>
                    <td className="px-3 py-1">{formatDateToLocal(purchase.date)}</td>
                    <td className="px-3 py-1">{purchase.platform}</td>
                    <td className="px-3 py-1">{purchase.seller_username}</td>
                    <td className="px-3 py-1">{purchase.listing_title}</td>
                    <td className="px-3 py-1">{formatCurrency(purchase.individual_price)}</td>
                    <td className="px-3 py-1">{purchase.quantity}</td>
                    <td className="px-3 py-1">{formatCurrency(purchase.shipping_price)}</td>
                    <td className="px-3 py-1">{formatCurrency(purchase.tax)}</td>
                    <td className="px-3 py-1">{formatCurrency(purchase.total)}</td>
                    <td className="px-3 py-1">{formatCurrency(purchase.amount_refunded)}</td>
                    <td className="px-3 py-1">{formatCurrency(purchase.respective_cost)}</td>
                    <td>
                      <div className="flex justify-end gap-3">
                        <UpdatePurchaseOrder order_number={order_number} item_id={purchase.item_id}/>
                        <DeletePurchaseOrder order_number={order_number} item_id={purchase.item_id}/>
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
