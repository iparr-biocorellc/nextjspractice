import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredSubscriptions } from '@/app/lib/data'; // Replace with actual function to fetch subscriptions
import { UpdateSubscription, DeleteSubscription } from '@/app/ui/expenses/buttons'; // Replace with actual buttons you have for subscriptions

export default async function SubscriptionsTable({
                                                   query,
                                                   currentPage,
                                                 }: {
  query: string;
  currentPage: number;
}) {
  const subscriptions = await fetchFilteredSubscriptions(query, currentPage);
  return (
      <div className="mt-6 flow-root overflow-scroll" style={{maxHeight: "800px"}}>
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-x-auto rounded-lg bg-gray-50 p-2 md:pt-0">
            <table className="min-w-full divide-y divide-gray-200 text-gray-900" style={{whiteSpace: "nowrap"}}>
              <thead className="bg-gray-50 text-left text-sm font-semibold">
              <tr>
                {/* Adjusted headers for the subscriptions columns */}
                <th scope="col" className="px-3 py-3">Service</th>
                <th scope="col" className="px-3 py-3">Frequency</th>
                <th scope="col" className="px-3 py-3">Begin Date</th>
                <th scope="col" className="px-3 py-3">Cost</th>
                <th scope="col" className="px-3 py-3">Archived Cost</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions?.map((subscription) => (
                  <tr key={subscription.id}>
                    {/* Data for the subscriptions columns */}
                    <td className="px-3 py-1">{subscription.service}</td>
                    <td className="px-3 py-1">{subscription.frequency}</td>
                    <td className="px-3 py-1">{formatDateToLocal(subscription.begin_date)}</td>
                    <td className="px-3 py-1">{formatCurrency(subscription.cost)}</td>
                    <td className="px-3 py-1">{formatCurrency(subscription.archived_cost)}</td>
                    <td className="px-3">
                      <div className="flex justify-end gap-3">
                        {/* Replace with actual update/delete actions for subscriptions */}
                        <UpdateSubscription id={subscription.id}/>
                        <DeleteSubscription id={subscription.id}/>
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
