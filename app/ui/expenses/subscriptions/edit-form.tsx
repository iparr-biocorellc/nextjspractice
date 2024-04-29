'use client';

import {Subscription} from '@/app/lib/definitions';
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
import { updateSubscription } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export default function EditSubscriptionForm({
  subscription,
}: {
  subscription: Subscription;
}) {
  const initialState = { message: null, errors: {} };
  const updateSubscriptionWithId = updateSubscription.bind(null, subscription.id);
  const [state, dispatch] = useFormState(updateSubscriptionWithId, initialState);
  return (
      <form action={dispatch}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Service */}
          <div className="mb-4">
            <label htmlFor="service" className="mb-2 block text-sm font-medium">
              Service
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                  id="service"
                  name="service"
                  type="text"
                  defaultValue={subscription.service}
                  placeholder="Enter Service"
                  className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
              <div id="service-error" aria-live="polite" aria-atomic="true">
                {state.errors?.service &&
                    state.errors.service.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* Frequency */}
          <div className="mb-4">
            <label htmlFor="frequency" className="mb-2 block text-sm font-medium">
              Frequency
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                  id="frequency"
                  name="frequency"
                  type="text"
                  defaultValue={subscription.frequency}
                  placeholder="Enter Frequency"
                  className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
              <div id="frequency-error" aria-live="polite" aria-atomic="true">
                {state.errors?.frequency &&
                    state.errors.frequency.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* Begin Date */}
          <div className="mb-4">
            <label htmlFor="begin-date" className="mb-2 block text-sm font-medium">
              Begin Date
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                  id="begin-date"
                  name="begin_date"
                  type="date"
                  defaultValue={subscription.begin_date ? new Date(subscription.begin_date).toISOString().split('T')[0] : ''}
                  placeholder="Enter Begin Date"
                  className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
              <div id="begin-date-error" aria-live="polite" aria-atomic="true">
                {state.errors?.begin_date &&
                    state.errors.begin_date.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* Cost */}
          <div className="mb-4">
            <label htmlFor="cost" className="mb-2 block text-sm font-medium">
              Cost
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                  id="cost"
                  name="cost"
                  type="number"
                  defaultValue={subscription.cost}
                  placeholder="Enter Cost"
                  className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
              <div id="cost-error" aria-live="polite" aria-atomic="true">
                {state.errors?.cost &&
                    state.errors.cost.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                    ))}
              </div>
            </div>
          </div>

          {/* Archived Cost */}
          <div className="mb-4">
            <label htmlFor="archived-cost" className="mb-2 block text-sm font-medium">
              Archived Cost
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                  id="archived-cost"
                  name="archived_cost"
                  type="number"
                  defaultValue={subscription.archived_cost}
                  placeholder="Enter Archived Cost"
                  className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
              <div id="archived-cost-error" aria-live="polite" aria-atomic="true">
                {state.errors?.archived_cost &&
                    state.errors.archived_cost.map((error: string) => (
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
                href="/dashboard/expenses"
                className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
            <Button type="submit">Edit Subscription</Button>
          </div>
        </div>
      </form>

  );
}
