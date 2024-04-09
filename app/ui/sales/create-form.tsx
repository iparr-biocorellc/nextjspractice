'use client';

import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { processSalesUpload } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export default function FileUploadForm() {

}


export default function Form() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(processSalesUpload, initialState);
  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Upload spreadsheet (.xlsx or .csv)
          </label>
            <input
                id="file"
                name="file"
                type="file"
                accept=".xlsx, .csv"
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link href="/dashboard/sales" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Cancel
        </Link>
        <Button type="submit">Upload Sales</Button>
      </div>
    </form>
  );
}
