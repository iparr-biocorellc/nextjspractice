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
        query?: string;
        page?: string;
    };
}) {
    const query = searchParams?.query || '';
    const page = Number(searchParams?.page) || 1;

    // Fetch total pages for each table separately
    const consumablesTotalPages = await fetchConsumablesPages(query);
    const subscriptionsTotalPages = await fetchSubscriptionsPages(query);

    return (
        <div className="w-full">
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search consumables and subscriptions..." />
                {/*<AddConsumable />*/}
                {/*<AddSubscription />*/}
            </div>
            <ConsumablesTable query={query} currentPage={page} />
            <SubscriptionsTable query={query} currentPage={page} />
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={subscriptionsTotalPages} />
            </div>
        </div>
    );
}
