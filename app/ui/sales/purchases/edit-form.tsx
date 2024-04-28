'use client';

import { Purchase } from '@/app/lib/definitions';
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
import { updatePurchaseOrder } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export default function EditPurchaseForm({
  order_number,
  item_id,
  purchase,
  respective_cost,
}: {
  order_number: string;
  item_id: string;
  purchase: Purchase;
  respective_cost: number;
}) {
  const initialState = { message: null, errors: {} };
  const updatePurchaseOrderWithId = updatePurchaseOrder.bind(null, order_number, item_id);
  const [state, dispatch] = useFormState(updatePurchaseOrderWithId, initialState);
  return (
      <form action={dispatch}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Item ID */}
            <div className="mb-4">
                <label htmlFor="item-id" className="mb-2 block text-sm font-medium">
                Item ID
                </label>
                <div className="relative mt-2 rounded-md">
                <div className="relative">
                    <input
                        id="item-id"
                        name="item_id"
                        type="text"
                        defaultValue={purchase.item_id}
                        disabled={true}
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <CheckIcon
                        className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                </div>
                </div>
            </div>


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
                    disabled={true}
                    defaultValue={purchase.date ? new Date(purchase.date).toISOString().slice(0, -8) : ''}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CalendarIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
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
                    disabled={true}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <ComputerDesktopIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
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
                    disabled={true}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <UserIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
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
                    disabled={true}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <ClipboardDocumentListIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
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
                    disabled={true}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CurrencyDollarIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
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
                    disabled={true}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <HashtagIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
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
                    disabled={true}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <TruckIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
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
                    disabled={true}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CalculatorIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
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
                    disabled={true}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CurrencyDollarIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
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
                    disabled={true}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <ArrowUturnLeftIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
            </div>
          </div>

          {/* Accounted Cost */}
            <div className="mb-4">
                <label htmlFor="accounted-cost" className="mb-2 block text-sm font-medium">
                Accounted Cost
                </label>
                <div className="relative mt-2 rounded-md">
                <div className="relative">
                    <input
                        id="accounted-cost"
                        name="accounted_cost"
                        type="number"
                        step="0.01"
                        defaultValue={purchase.cost_accounted}
                        disabled={true}
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <CurrencyDollarIcon
                        className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                </div>
                </div>
            </div>

              {/* Outstanding Cost */}
              <div className="mb-4">
                <label htmlFor="outstanding-cost" className="mb-2 block text-sm font-medium">
                  Outstanding Cost
                </label>
                <div className="relative mt-2 rounded-md">
                  <div className="relative">
                    <input
                        id="outstanding-cost"
                        name="outstanding_cost"
                        type="number"
                        step="0.01"
                        defaultValue={purchase.cost_outstanding}
                        disabled={true}
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <CurrencyDollarIcon
                        className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                  </div>
                </div>
                </div>

                {/* Respective Cost */}
                <div className="mb-4">
                  <label htmlFor="respective-cost" className="mb-2 block text-sm font-medium">
                    Respective Cost
                  </label>
                  <div className="relative mt-2 rounded-md">
                    <div className="relative">
                      <input
                          id="respective-cost"
                          name="respective_cost"
                          type="number"
                          step="0.01"
                          defaultValue={respective_cost}
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                      />
                      <CurrencyDollarIcon
                          className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                    </div>
                    <div id="item-id-error" aria-live="polite" aria-atomic="true">
                      {state.errors?.respective_cost &&
                          state.errors.respective_cost.map((error: string) => (
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
                      href={`/dashboard/sales/${order_number}/purchase-cost`}
                      className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
                      Cancel
                    </Link>
            <Button type="submit">Edit Purchase Order</Button>
          </div>
        </div>
      </form>

  );
}
