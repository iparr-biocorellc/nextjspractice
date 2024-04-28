import Pagination from '@/app/ui/expenses/pagination';
import Search from '@/app/ui/search';
import { AddConsumable, AddSubscription } from '@/app/ui/expenses/buttons';
import { fetchConsumablesPages, fetchSubscriptionsPages } from '@/app/lib/data'; // Assuming different fetching functions
import SubscriptionsTable from "@/app/ui/expenses/subscriptions/table";
import ConsumablesTable from "@/app/ui/expenses/consumables/table";

export default async function Page({
                                       searchParams,
                                   }: {
    searchParams?: {
        consumablesQuery?: string;
        subscriptionsQuery?: string;
        consumablesPage?: string;
        subscriptionsPage?: string;
    };
}) {
    // Separate queries and page numbers for each table
    const consumablesQuery = searchParams?.consumablesQuery || '';
    const subscriptionsQuery = searchParams?.subscriptionsQuery || '';
    const consumablesPage = Number(searchParams?.consumablesPage) || 1;
    const subscriptionsPage = Number(searchParams?.subscriptionsPage) || 1;

    // Fetch total pages for each table separately
    const consumablesTotalPages = await fetchConsumablesPages(consumablesQuery);
    const subscriptionsTotalPages = await fetchSubscriptionsPages(subscriptionsQuery);

    return (
        <div className="w-full">
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search consumables..." />
                <AddConsumable />
            </div>
            <ConsumablesTable query={consumablesQuery} currentPage={consumablesPage} />
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={consumablesTotalPages} />
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search subscriptions..." />
                <AddSubscription />
            </div>
            <SubscriptionsTable query={subscriptionsQuery} currentPage={subscriptionsPage} />
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={subscriptionsTotalPages} />
            </div>
        </div>
    );
}
