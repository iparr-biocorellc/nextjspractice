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

export default function AddPurchaseCost({
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
