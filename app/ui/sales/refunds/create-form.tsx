'use client';
import {
  CurrencyDollarIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  ScaleIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createRefund } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export default function CreateRefundForm({ order_number }: { order_number: string }) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createRefund, initialState);

  return (
      <form action={dispatch}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <input type="hidden" name="order_number" value={order_number} />

          {/* ID Field */}
          <div className="mb-4">
            <label htmlFor="id" className="mb-2 block text-sm font-medium">ID</label>
            <div className="relative">
              <input
                  id="id"
                  name="id"
                  type="number"
                  placeholder="Enter ID"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
              />
              <ClipboardDocumentListIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
              />
            </div>
          </div>

          {/* Gross Amount */}
          <div className="mb-4">
            <label htmlFor="gross-amount" className="mb-2 block text-sm font-medium">Gross Amount</label>
            <div className="relative">
              <input
                  id="gross-amount"
                  name="gross_amount"
                  type="number"
                  step="0.01"
                  placeholder="Enter Gross Amount"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
              />
              <CurrencyDollarIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
              />
            </div>
          </div>

          {/* Refund Type */}
          <div className="mb-4">
            <label htmlFor="refund-type" className="mb-2 block text-sm font-medium">Refund Type</label>
            <div className="relative">
              <input
                  id="refund-type"
                  name="refund_type"
                  type="text"
                  placeholder="Enter Refund Type"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
              />
              <TagIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
              />
            </div>
          </div>

          {/* FV Fixed Credit */}
          <div className="mb-4">
            <label htmlFor="fv-fixed-credit" className="mb-2 block text-sm font-medium">FV Fixed Credit</label>
            <div className="relative">
              <input
                  id="fv-fixed-credit"
                  name="fv_fixed_credit"
                  type="number"
                  step="0.01"
                  placeholder="Enter FV Fixed Credit"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
              />
              <ScaleIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
              />
            </div>
          </div>

          {/* FV Variable Credit */}
          <div className="mb-4">
            <label htmlFor="fv-variable-credit" className="mb-2 block text-sm font-medium">FV Variable Credit</label>
            <div className="relative">
              <input
                  id="fv-variable-credit"
                  name="fv_variable_credit"
                  type="number"
                  step="0.01"
                  placeholder="Enter FV Variable Credit"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
              />
              <GlobeAltIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
              />
            </div>
          </div>

          {/* eBay Tax Refunded */}
          <div className="mb-4">
            <label htmlFor="ebay-tax-refunded" className="mb-2 block text-sm font-medium">eBay Tax Refunded</label>
            <div className="relative">
              <input
                  id="ebay-tax-refunded"
                  name="ebay_tax_refunded"
                  type="number"
                  step="0.01"
                  placeholder="Enter eBay Tax Refunded"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
              />
              <ScaleIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
              />
            </div>
          </div>

          {/* Net Amount */}
          <div className="mb-4">
            <label htmlFor="net-amount" className="mb-2 block text-sm font-medium">Net Amount</label>
            <div className="relative">
              <input
                  id="net-amount"
                  name="net_amount"
                  type="number"
                  step="0.01"
                  placeholder="Enter Net Amount"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
              />
              <CurrencyDollarIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
              />
            </div>
          </div>

          {/* Date of Refund */}
          <div className="mb-4">
            <label htmlFor="date" className="mb-2 block text-sm font-medium">Date of Refund</label>
            <div className="relative">
              <input
                  id="date"
                  name="date"
                  type="date"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
              />
              <CalendarIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
              />
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <Link href="/dashboard/sales" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">Cancel</Link>
            <Button type="submit">Create Refund</Button>
          </div>
        </div>
      </form>
  );
}
