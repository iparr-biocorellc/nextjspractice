import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredConsumables } from '@/app/lib/data'; // Function to fetch consumables
import { UpdateConsumable, DeleteConsumable } from '@/app/ui/expenses/buttons'; // Buttons for consumable actions

export default async function ConsumablesTable({
                                                   query,
                                                   currentPage,
                                               }: {
    query: string;
    currentPage: number;
}) {
    const consumables = await fetchFilteredConsumables(query, currentPage);
    return (
        <div className="mt-6 flow-root overflow-scroll" style={{ maxHeight: "800px" }}>
            <div className="inline-block min-w-full align-middle">
                <div className="overflow-x-auto rounded-lg bg-gray-50 p-2 md:pt-0">
                    <table className="min-w-full divide-y divide-gray-200 text-gray-900" style={{ whiteSpace: "nowrap" }}>
                        <thead className="bg-gray-50 text-left text-sm font-semibold">
                        <tr>
                            {/* Headers adjusted for consumables columns */}
                            <th scope="col" className="px-3 py-3">Date</th>
                            <th scope="col" className="px-3 py-3">Item</th>
                            <th scope="col" className="px-3 py-3">Cost</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {consumables?.map((consumable) => (
                            <tr key={consumable.id}>
                                {/* Data cells adjusted for consumables */}
                                <td className="px-3 py-1">{formatDateToLocal(consumable.date)}</td>
                                <td className="px-3 py-1">{consumable.item}</td>
                                <td className="px-3 py-1">{formatCurrency(consumable.cost)}</td>
                                <td className="px-3">
                                    <div className="flex justify-end gap-3">
                                        {/* Replace with actual update/delete actions for consumables */}
                                        <UpdateConsumable id={consumable.id}/>
                                        <DeleteConsumable id={consumable.id}/>
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
