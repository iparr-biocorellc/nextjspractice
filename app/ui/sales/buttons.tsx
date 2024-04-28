import {
    PencilIcon,
    PlusIcon,
    TrashIcon,
    CurrencyDollarIcon,
    TruckIcon,
    ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteOrder, deletePurchaseOrder, deleteLabel, deleteRefund } from '@/app/lib/actions';


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

// UploadRefunds function
export function UploadRefunds() {
    return (
        <Link
        href="/dashboard/sales/upload/refunds"
        className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
        <span className="hidden md:block">Upload Refunds</span>{' '}
        <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );

}

export function UploadLabels() {
    return (
        <Link
        href="/dashboard/sales/upload/labels"
        className="flex h-10 items-center rounded-lg bg-gray-600 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
        <span className="hidden md:block">Upload Labels</span>{' '}
        <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}

// UploadPurchases
export function LinkPurchases() {
    return (
        <Link
        href="/dashboard/sales/upload/purchases"
        className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
        <span className="hidden md:block">Link Purchases</span>{' '}
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

export function UpdatePurchaseCost({ order_number }: { order_number: string }) {
    return (
        <Link
            href={`/dashboard/sales/${order_number}/purchase-cost`}
            className="rounded-md border p-2 hover:bg-gray-100"
        >
            <CurrencyDollarIcon className="w-5" />
        </Link>
    );
}

export function UpdatePurchaseOrder({ order_number, item_id }: { order_number: string, item_id: string }) {
    return (
        <Link
            href={`/dashboard/sales/${order_number}/purchase-cost/${item_id}/edit`}
            className="rounded-md border p-2 hover:bg-gray-100"
        >
            <PencilIcon className="w-5" />
        </Link>
    );
}

export function UpdateLabel({ order_number, tracking_number }: { order_number: string, tracking_number: string }) {
    return (
        <Link
            href={`/dashboard/sales/${order_number}/labels/${tracking_number}/edit`}
            className="rounded-md border p-2 hover:bg-gray-100"
        >
            <TruckIcon className="w-5" />
        </Link>
    );
}

export function UpdateRefund({ order_number, id }: { order_number: string, id: number }) {
    return (
        <Link
            href={`/dashboard/sales/${order_number}/refunds/${id}/edit`}
            className="rounded-md border p-2 hover:bg-gray-100"
        >
            <PencilIcon className="w-5" />
        </Link>
    );
}

export function DeleteLabel({ tracking_number }: { tracking_number: string}) {
    const deleteLabelOrderWithId = deleteLabel.bind(null, tracking_number);
    return (
        <form action={deleteLabelOrderWithId}>
            <button className="rounded-md border p-2 hover:bg-gray-100">
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-4" />
            </button>
        </form>
    );
}

export function DeleteRefund({ id }: { id: number }) {
    const deleteRefundWithId = deleteRefund.bind(null, id);
    return (
        <form action={deleteRefundWithId}>
            <button className="rounded-md border p-2 hover:bg-gray-100">
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-4" />
            </button>
        </form>
    );
}

export function UpdateLabelCost({ order_number }: { order_number: string }) {
    return (
        <Link
            href={`/dashboard/sales/${order_number}/labels`}
            className="rounded-md border p-2 hover:bg-gray-100"
        >
            <TruckIcon className="w-5" />
        </Link>
    );
}

export function UpdateRefunded({ order_number }: { order_number: string }) {
    return (
        <Link
            href={`/dashboard/sales/${order_number}/refunds`}
            className="rounded-md border p-2 hover:bg-gray-100"
        >
            <ArrowUturnLeftIcon className="w-5" />
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

export function DeletePurchaseOrder({ order_number, item_id }: { order_number: string, item_id: string }) {
    const deletePurchaseOrderWithId = deletePurchaseOrder.bind(null, order_number, item_id);
    return (
        <form action={deletePurchaseOrderWithId}>
            <button className="rounded-md border p-2 hover:bg-gray-100">
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-4" />
            </button>
        </form>
    );
}
