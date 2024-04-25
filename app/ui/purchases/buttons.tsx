import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deletePurchase } from '@/app/lib/actions';


export function UploadPurchases() {
  return (
    <Link
      href="/dashboard/purchases/upload"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Upload Purchases</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdatePurchase({ item_id }: { item_id: string }) {
  return (
      <Link
          href={`/dashboard/purchases/${item_id}/edit`}
          className="rounded-md border p-2 hover:bg-gray-100"
      >
        <PencilIcon className="w-5" />
      </Link>
  );
}

export function DeletePurchase({ item_id }: { item_id: string }) {
    const deletePurchaseWithId = deletePurchase.bind(null, item_id);
    return (
        <form action={deletePurchaseWithId}>
            <button className="rounded-md border p-2 hover:bg-gray-100">
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-4" />
            </button>
        </form>
    );
}
