import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteOrder } from '@/app/lib/actions';


export function UploadSales() {
  return (
    <Link
      href="/dashboard/sales/upload"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Upload Sales</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateOrder({ order_number }: { order_number: string }) {
  return (
      <Link
          href={`/dashboard/sales/${order_number}/edit`}
          className="rounded-md border p-2 hover:bg-gray-100"
      >
        <PencilIcon className="w-5" />
      </Link>
  );
}

export function DeleteOrder({ order_number }: { order_number: string }) {
    const deleteOrderWithId = deleteOrder.bind(null, order_number);
    return (
        <form action={deleteOrderWithId}>
            <button className="rounded-md border p-2 hover:bg-gray-100">
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-4" />
            </button>
        </form>
    );
}
