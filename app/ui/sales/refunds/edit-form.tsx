'use client';
import { Refund } from '@/app/lib/definitions';
import {
  CurrencyDollarIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  IdentificationIcon,
  GlobeAltIcon,
  ScaleIcon,
  InboxIcon,
  HashtagIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateRefund } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export default function EditRefundForm({
                                         order_number,
    id,
                                         refund,
                                       }: {
  order_number: string;
    id: number;
  refund: Refund;
}) {
  const initialState = { message: null, errors: {} };
  const updateRefundWithID = updateRefund.bind(null, id, order_number);
  const [state, dispatch] = useFormState(updateRefundWithID, initialState);

  return (
      <form action={dispatch}>
          <div className="rounded-md bg-gray-50 p-4 md:p-6">
              <div className="mb-4">
                  <label htmlFor="id" className="mb-2 block text-sm font-medium">ID</label>
                  <div className="relative">
                      <input
                          id="id"
                          name="id"
                          type="number"
                          defaultValue={refund.id}
                          disabled={true}
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
                      />
                      <HashtagIcon
                          className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
                      />
                  </div>
                  <div id="id-error" aria-live="polite" aria-atomic="true">
                      {state?.errors?.id &&
                          state.errors.id.map((error: string) => (
                              <p className="mt-2 text-sm text-red-500" key={error}>
                                  {error}
                              </p>
                          ))}
                  </div>
              </div>

              <div className="mb-4">
                  <label htmlFor="gross-amount" className="mb-2 block text-sm font-medium">Gross Amount</label>
                  <div className="relative">
                      <input
                          id="gross-amount"
                          name="gross_amount"
                          type="number"
                          step="0.01"
                          defaultValue={refund.gross_amount}
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
                      />
                      <CurrencyDollarIcon
                          className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
                      />
                  </div>
                  <div id="gross-amount-error" aria-live="polite" aria-atomic="true">
                      {state?.errors?.gross_amount &&
                          state.errors.gross_amount.map((error: string) => (
                              <p className="mt-2 text-sm text-red-500" key={error}>
                                  {error}
                              </p>
                          ))}
                  </div>
              </div>

              <div className="mb-4">
                  <label htmlFor="refund-type" className="mb-2 block text-sm font-medium">Refund Type</label>
                  <div className="relative">
                      <input
                          id="refund-type"
                          name="refund_type"
                          type="text"
                          defaultValue={refund.refund_type}
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
                      />
                      <IdentificationIcon
                          className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
                      />
                  </div>
                  <div id="refund-type-error" aria-live="polite" aria-atomic="true">
                      {state?.errors?.refund_type &&
                          state.errors.refund_type.map((error: string) => (
                              <p className="mt-2 text-sm text-red-500" key={error}>
                                  {error}
                              </p>
                          ))}
                  </div>
              </div>

              <div className="mb-4">
                  <label htmlFor="fv-fixed-credit" className="mb-2 block text-sm font-medium">FV Fixed Credit</label>
                  <div className="relative">
                      <input
                          id="fv-fixed-credit"
                          name="fv_fixed_credit"
                          type="number"
                          step="0.01"
                          defaultValue={refund.fv_fixed_credit}
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
                      />
                      <ScaleIcon
                          className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
                      />
                  </div>
                  <div id="fv-fixed-credit-error" aria-live="polite" aria-atomic="true">
                      {state?.errors?.fv_fixed_credit &&
                          state.errors.fv_fixed_credit.map((error: string) => (
                              <p className="mt-2 text-sm text-red-500" key={error}>
                                  {error}
                              </p>
                          ))}
                  </div>
              </div>

              <div className="mb-4">
                  <label htmlFor="fv-variable-credit" className="mb-2 block text-sm font-medium">FV Variable
                      Credit</label>
                  <div className="relative">
                      <input
                          id="fv-variable-credit"
                          name="fv_variable_credit"
                          type="number"
                          step="0.01"
                          defaultValue={refund.fv_variable_credit}
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
                      />
                      <GlobeAltIcon
                          className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
                      />
                  </div>
                  <div id="fv-variable-credit-error" aria-live="polite" aria-atomic="true">
                      {state?.errors?.fv_variable_credit &&
                          state.errors.fv_variable_credit.map((error: string) => (
                              <p className="mt-2 text-sm text-red-500" key={error}>
                                  {error}
                              </p>
                          ))}
                  </div>
              </div>

              <div className="mb-4">
                  <label htmlFor="ebay-tax-refunded" className="mb-2 block text-sm font-medium">eBay Tax
                      Refunded</label>
                  <div className="relative">
                      <input
                          id="ebay-tax-refunded"
                          name="ebay_tax_refunded"
                          type="number"
                          step="0.01"
                          defaultValue={refund.ebay_tax_refunded}
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
                      />
                      <InboxIcon
                          className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
                      />
                  </div>
                  <div id="ebay-tax-refunded-error" aria-live="polite" aria-atomic="true">
                      {state?.errors?.ebay_tax_refunded &&
                          state.errors.ebay_tax_refunded.map((error: string) => (
                              <p className="mt-2 text-sm text-red-500" key={error}>
                                  {error}
                              </p>
                          ))}
                  </div>
              </div>

              <div className="mb-4">
                  <label htmlFor="net-amount" className="mb-2 block text-sm font-medium">Net Amount</label>
                  <div className="relative">
                      <input
                          id="net-amount"
                          name="net_amount"
                          type="number"
                          step="0.01"
                          defaultValue={refund.net_amount}
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
                      />
                      <CurrencyDollarIcon
                          className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
                      />
                  </div>
                  <div id="net-amount-error" aria-live="polite" aria-atomic="true">
                      {state?.errors?.net_amount &&
                          state.errors.net_amount.map((error: string) => (
                              <p className="mt-2 text-sm text-red-500" key={error}>
                                  {error}
                              </p>
                          ))}
                  </div>
              </div>

              <div className="mb-4">
                  <label htmlFor="date" className="mb-2 block text-sm font-medium">Date of Refund</label>
                  <div className="relative">
                      <input
                          id="date"
                          name="date"
                          type="date"
                          defaultValue={refund.date ? new Date(refund.date).toISOString().split('T')[0] : ''}
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
                      />
                      <CalendarIcon
                          className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
                      />
                  </div>
                  <div id="date-error" aria-live="polite" aria-atomic="true">
                      {state?.errors?.date &&
                          state.errors.date.map((error: string) => (
                              <p className="mt-2 text-sm text-red-500" key={error}>
                                  {error}
                              </p>
                          ))}
                  </div>
              </div>

              <div aria-live="polite" aria-atomic="true">
                  {state?.message && (
                      <p className="mt-2 text-sm text-red-500" key={state.message}>
                          {state.message}
                      </p>
                  )}
              </div>

              <div className="mt-6 flex justify-end gap-4">
                  <Link
                      href={`/dashboard/sales/${order_number}/refunds`}
                      className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                  >
                      Cancel
                  </Link>
                  <Button type="submit"
                          className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                      Update Refund
                  </Button>
              </div>
          </div>
      </form>
  );
}
