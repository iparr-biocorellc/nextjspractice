'use client';

import { OrderForm } from '@/app/lib/definitions';
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
  IdentificationIcon, MapPinIcon, MapIcon, InboxIcon, CheckBadgeIcon, ScaleIcon, GlobeAltIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateOrder } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export default function EditOrderForm({
  order,
}: {
  order: OrderForm;
}) {
  const initialState = { message: null, errors: {} };
  const updateOrderWithId = updateOrder.bind(null, order.order_number);
  const [state, dispatch] = useFormState(updateOrderWithId, initialState);
  return (
      <form action={dispatch}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Date */}
          <div className="mb-4">
            <label htmlFor="date" className="mb-2 block text-sm font-medium">
              Date of Order
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="date"
                    name="date"
                    type="date"
                    defaultValue={order.date ? new Date(order.date).toISOString().split('T')[0] : ''}
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

          {/* Item Title */}
          <div className="mb-4">
            <label htmlFor="item-title" className="mb-2 block text-sm font-medium">
              Item Title
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="item-title"
                    name="item_title"
                    type="text"
                    defaultValue={order.item_title}
                    placeholder="Enter Item Title"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <ClipboardDocumentListIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="item-title-error" aria-live="polite" aria-atomic="true">
                {state.errors?.item_title &&
                    state.errors.item_title.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

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
                    defaultValue={order.item_id}
                    placeholder="Enter Item ID"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <IdentificationIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="item-id-error" aria-live="polite" aria-atomic="true">
                {state.errors?.item_id &&
                    state.errors.item_id.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* Buyer Username */}
          <div className="mb-4">
            <label htmlFor="buyer-username" className="mb-2 block text-sm font-medium">
              Buyer Username
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="buyer-username"
                    name="buyer_username"
                    type="text"
                    defaultValue={order.buyer_username}
                    placeholder="Enter Buyer's Username"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <UserCircleIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="buyer-username-error" aria-live="polite" aria-atomic="true">
                {state.errors?.buyer_username &&
                    state.errors.buyer_username.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* Buyer Name */}
          <div className="mb-4">
            <label htmlFor="buyer-name" className="mb-2 block text-sm font-medium">
              Buyer Name
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="buyer-name"
                    name="buyer_name"
                    type="text"
                    defaultValue={order.buyer_name}
                    placeholder="Enter Buyer's Name"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <UserIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="buyer-name-error" aria-live="polite" aria-atomic="true">
                {state.errors?.buyer_name &&
                    state.errors.buyer_name.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* City */}
          <div className="mb-4">
            <label htmlFor="city" className="mb-2 block text-sm font-medium">
              City
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="city"
                    name="city"
                    type="text"
                    defaultValue={order.city}
                    placeholder="Enter City"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <MapPinIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="city-error" aria-live="polite" aria-atomic="true">
                {state.errors?.city &&
                    state.errors.city.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* State */}
          <div className="mb-4">
            <label htmlFor="state" className="mb-2 block text-sm font-medium">
              State
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="state"
                    name="state"
                    type="text"
                    defaultValue={order.state}
                    placeholder="Enter State"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <MapIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="state-error" aria-live="polite" aria-atomic="true">
                {state.errors?.state &&
                    state.errors.state.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* Zip Code */}
          <div className="mb-4">
            <label htmlFor="zip" className="mb-2 block text-sm font-medium">
              Zip Code
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="zip"
                    name="zip"
                    type="text"
                    defaultValue={order.zip}
                    placeholder="Enter Zip Code"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <InboxIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                </div>
                <div id="zip-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.zip &&
                        state.errors.zip.map((error: string) => (
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
                    defaultValue={order.quantity}
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

          {/* Item Subtotal */}
          <div className="mb-4">
            <label htmlFor="item-subtotal" className="mb-2 block text-sm font-medium">
              Item Subtotal
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="item-subtotal"
                    name="item_subtotal"
                    type="number"
                    step="0.01"
                    defaultValue={order.item_subtotal}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CurrencyDollarIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="item-subtotal-error" aria-live="polite" aria-atomic="true">
                {state.errors?.item_subtotal &&
                    state.errors.item_subtotal.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* Shipping & Handling */}
          <div className="mb-4">
            <label htmlFor="shipping-handling" className="mb-2 block text-sm font-medium">
              Shipping & Handling
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="shipping-handling"
                    name="shipping_handling"
                    type="number"
                    step="0.01"
                    defaultValue={order.shipping_handling}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <TruckIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="shipping-handling-error" aria-live="polite" aria-atomic="true">
              {state.errors?.shipping_handling &&
                  state.errors.shipping_handling.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                  ))}
              </div>
            </div>
          </div>

          {/* eBay Collected Tax */}
          <div className="mb-4">
            <label htmlFor="ebay-collected-tax" className="mb-2 block text-sm font-medium">
              eBay Collected Tax
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="ebay-collected-tax"
                    name="ebay_collected_tax"
                    type="number"
                    step="0.01"
                    defaultValue={order.ebay_collected_tax}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CheckBadgeIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="ebay-collected-tax-error" aria-live="polite" aria-atomic="true">
                {state.errors?.ebay_collected_tax &&
                    state.errors.ebay_collected_tax.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* FV Fixed */}
          <div className="mb-4">
            <label htmlFor="fv-fixed" className="mb-2 block text-sm font-medium">
              FV Fixed
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="fv-fixed"
                    name="fv_fixed"
                    type="number"
                    step="0.01"
                    defaultValue={order.fv_fixed}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CalculatorIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="fv-fixed-error" aria-live="polite" aria-atomic="true">
                {state.errors?.fv_fixed &&
                    state.errors.fv_fixed.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* FV Variable */}
          <div className="mb-4">
            <label htmlFor="fv-variable" className="mb-2 block text-sm font-medium">
              FV Variable
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="fv-variable"
                    name="fv_variable"
                    type="number"
                    step="0.01"
                    defaultValue={order.fv_variable}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <ScaleIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="fv-variable-error" aria-live="polite" aria-atomic="true">
                {state.errors?.fv_variable &&
                    state.errors.fv_variable.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* International Fee */}
          <div className="mb-4">
            <label htmlFor="international-fee" className="mb-2 block text-sm font-medium">
              International Fee
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="international-fee"
                    name="international_fee"
                    type="number"
                    step="0.01"
                    defaultValue={order.international_fee}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <GlobeAltIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="international-fee-error" aria-live="polite" aria-atomic="true">
                {state.errors?.international_fee &&
                    state.errors.international_fee.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* Gross Amount */}
          <div className="mb-4">
            <label htmlFor="gross-amount" className="mb-2 block text-sm font-medium">
              Gross Amount
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="gross-amount"
                    name="gross_amount"
                    type="number"
                    step="0.01"
                    defaultValue={order.gross_amount}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CurrencyDollarIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="gross-amount-error" aria-live="polite" aria-atomic="true">
                {state.errors?.gross_amount &&
                    state.errors.gross_amount.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* Net Amount */}
          <div className="mb-4">
            <label htmlFor="net-amount" className="mb-2 block text-sm font-medium">
              Net Amount
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                    id="net-amount"
                    name="net_amount"
                    type="number"
                    step="0.01"
                    defaultValue={order.net_amount}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CalculatorIcon
                    className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              </div>
              <div id="net-amount-error" aria-live="polite" aria-atomic="true">
                {state.errors?.net_amount &&
                    state.errors.net_amount.map((error: string) => (
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
                href="/dashboard/sales"
                className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
            <Button type="submit">Edit Order</Button>
          </div>
        </div>
      </form>

  );
}
