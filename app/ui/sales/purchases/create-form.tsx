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
  IdentificationIcon, MapPinIcon, MapIcon, InboxIcon, CheckBadgeIcon, ScaleIcon, GlobeAltIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createPurchaseOrder } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export default function CreatePurchaseOrderForm({order_number, purchases}: {order_number: string, purchases: Purchase[] }) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createPurchaseOrder, initialState);
  return (
      <form action={dispatch}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">

          {/* Purchase Selection Dropdown */}
          <div className="mb-4">
            <label htmlFor="purchase-selection" className="mb-2 block text-sm font-medium">
              Select Purchase
            </label>
            <div className="relative">
              <select
                  id="item-id"
                  name="item_id"
                  className="block w-full rounded-md border border-gray-200 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  defaultValue=""
              >
                {purchases.map(purchase => (
                    <option key={purchase.item_id} value={purchase.item_id}>
                      {purchase.listing_title} - ${purchase.cost_outstanding}
                    </option>
                ))}
              </select>
              {/* Dynamically loaded icon for dropdown */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.292 7.292a1 1 0 011.414 0L10 10.586l3.294-3.294a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              {/* Error message for purchase selection */}
              <div id="item-id-error" aria-live="polite" aria-atomic="true">
                {/* Handle errors here */}
                {state.errors?.item_id &&
                    state.errors.item_id.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                    ))}
              </div>
            </div>
          </div>

          {/* Respective Cost Input */}
          <div className="mb-4">
            <label htmlFor="respective-cost" className="mb-2 block text-sm font-medium">
              Respective Cost
            </label>
            <div className="relative">
              <input
                  id="respective-cost"
                  name="respective_cost"
                  type="number"
                  step="0.01"
                  defaultValue={0}
                  className="block w-full rounded-md border border-gray-200 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              {/* Error for respective cost */}
              <div id="respective-cost-error" aria-live="polite" aria-atomic="true">
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
            <Link href="/dashboard/sales"
              className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
                Cancel
            </Link>
            <Button type="submit">Create Purchase Order</Button>
          </div>
        </div>
      </form>
  );
}