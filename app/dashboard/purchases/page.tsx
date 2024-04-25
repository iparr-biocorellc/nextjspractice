import Pagination from '@/app/ui/sales/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/sales/table';
import { UploadSales } from '@/app/ui/sales/buttons';
import { lusitana } from '@/app/ui/fonts';
// import { Suspense } from 'react';
// import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { fetchOrdersPages } from '@/app/lib/data';

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    const totalPages = await fetchOrdersPages(query);

    return (
        <div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search sales..." />
                <UploadSales />
            </div>
                {/*<Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>*/}
                    <Table query={query} currentPage={currentPage} />
                {/*</Suspense>*/}
                <div className="mt-5 flex w-full justify-center">
                    <Pagination totalPages={totalPages} />
                </div>
            </div>
    );
}