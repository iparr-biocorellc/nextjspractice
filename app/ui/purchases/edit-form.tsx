'use client';

import { PurchaseForm } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
    CalendarIcon,
    CalendarDaysIcon,
    ComputerDesktopIcon,
    UserIcon,
    ClipboardDocumentListIcon,
    HashtagIcon,
    TruckIcon,
    CalculatorIcon,
    ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updatePurchase } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export default function EditPurchaseForm({
  purchase,
}: {
  purchase: PurchaseForm;
}) {
  const initialState = { message: null, errors: {} };
  const updatePurchaseWithId = updatePurchase.bind(null, purchase.item_id);
  const [state, dispatch] = useFormState(updatePurchaseWithId, initialState);
  return (
      <form action={dispatch}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">

          {/* Date */}
          <div className="mb-4">
            <label htmlFor="date" className="mb-2 block text-sm font-medium">
              Date and Time of Purchase
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="date"
                    name="date"
                    type="datetime-local"
                    defaultValue={purchase.date ? new Date(purchase.date).toISOString().slice(0, -8) : ''}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CalendarIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="date-error" aria-live="polite" aria-atomic="true">
                {state.errors?.date &&
                    state.errors.date.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* Platform */}
          <div className="mb-4">
            <label htmlFor="platform" className="mb-2 block text-sm font-medium">
              Platform
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="platform"
                    name="platform"
                    type="text"
                    defaultValue={purchase.platform}
                    placeholder="Enter Platform Name"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <ComputerDesktopIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="platform-error" aria-live="polite" aria-atomic="true">
                {state.errors?.platform &&
                    state.errors.platform.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* Seller Username */}
          <div className="mb-4">
            <label htmlFor="seller-username" className="mb-2 block text-sm font-medium">
              Seller Username
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="seller-username"
                    name="seller_username"
                    type="text"
                    defaultValue={purchase.seller_username}
                    placeholder="Enter Seller's Username"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <UserIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="seller-username-error" aria-live="polite" aria-atomic="true">
                {state.errors?.seller_username &&
                    state.errors.seller_username.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* Listing Title */}
          <div className="mb-4">
            <label htmlFor="listing-title" className="mb-2 block text-sm font-medium">
              Listing Title
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="listing-title"
                    name="listing_title"
                    type="text"
                    defaultValue={purchase.listing_title}
                    placeholder="Enter Listing Title"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <ClipboardDocumentListIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="listing-title-error" aria-live="polite" aria-atomic="true">
                {state.errors?.listing_title &&
                    state.errors.listing_title.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* Individual Price */}
          <div className="mb-4">
            <label htmlFor="individual-price" className="mb-2 block text-sm font-medium">
              Individual Price
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="individual-price"
                    name="individual_price"
                    type="number"
                    step="0.01"
                    defaultValue={purchase.individual_price}
                    placeholder="Enter Price in USD"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CurrencyDollarIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="individual-price-error" aria-live="polite" aria-atomic="true">
                {state.errors?.individual_price &&
                    state.errors.individual_price.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
              Quantity
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    defaultValue={purchase.quantity}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <HashtagIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="quantity-error" aria-live="polite" aria-atomic="true">
                {state.errors?.quantity &&
                    state.errors.quantity.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* Shipping Price */}
          <div className="mb-4">
            <label htmlFor="shipping-price" className="mb-2 block text-sm font-medium">
              Shipping Price
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="shipping-price"
                    name="shipping_price"
                    type="number"
                    step="0.01"
                    defaultValue={purchase.shipping_price}
                    placeholder="Enter Shipping Cost in USD"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <TruckIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="shipping-price-error" aria-live="polite" aria-atomic="true">
                {state.errors?.shipping_price &&
                    state.errors.shipping_price.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* Tax */}
          <div className="mb-4">
            <label htmlFor="tax" className="mb-2 block text-sm font-medium">
              Tax
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="tax"
                    name="tax"
                    type="number"
                    step="0.01"
                    defaultValue={purchase.tax}
                    placeholder="Enter Tax Amount"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CalculatorIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="tax-error" aria-live="polite" aria-atomic="true">
                {state.errors?.tax &&
                    state.errors.tax.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="mb-4">
            <label htmlFor="total" className="mb-2 block text-sm font-medium">
              Total
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="total"
                    name="total"
                    type="number"
                    step="0.01"
                    defaultValue={purchase.total}
                    placeholder="Enter Total Amount"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CurrencyDollarIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="total-error" aria-live="polite" aria-atomic="true">
                {state.errors?.total &&
                    state.errors.total.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* Amount Refunded */}
          <div className="mb-4">
            <label htmlFor="amount-refunded" className="mb-2 block text-sm font-medium">
              Amount Refunded
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="amount-refunded"
                    name="amount_refunded"
                    type="number"
                    step="0.01"
                    defaultValue={purchase.amount_refunded}
                    placeholder="Enter Refunded Amount"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <ArrowUturnLeftIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="amount-refunded-error" aria-live="polite" aria-atomic="true">
                {state.errors?.amount_refunded &&
                    state.errors.amount_refunded.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          <div aria-live="polite" aria-atomic="true">
            {state.message && (
                <p className="mt-2 text-sm text-red-500" key={state.message}>
                  {state.message}
                </p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Link
                href="/dashboard/purchases"
                className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
            <Button type="submit">Edit Purchase</Button>
          </div>
        </div>
      </form>

  );
}
