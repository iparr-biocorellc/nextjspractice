'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { Button } from '@/app/ui/button';
import { uploadOrders } from '@/app/lib/actions'; // Ensure you create this function similar to createInvoice

export default function SalesForm() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files ? event.target.files[0] : null);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) {
            setMessage('No file selected.');
            return;
        }

        setIsUploading(true);
        Papa.parse(file, {
            header: true,
            complete: async (results: { data: any; errors: any; }) => {
                const { data, errors } = results;
                if (errors.length) {
                    setMessage('Failed to parse CSV file.');
                    setIsUploading(false);
                    return;
                }

                // Assuming uploadSales accepts an array of sales records
                const response = await uploadOrders(data);
                setMessage(response.message || 'Failed to upload sales.');
                setIsUploading(false);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="file" className="block mb-2 text-sm font-medium">
                    Upload CSV File
                </label>
                <input
                    type="file"
                    id="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-900 border-gray-300 rounded-lg cursor-pointer focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Button type="submit" disabled={isUploading}>Upload Orders</Button>
            </div>
            {message && (
                <p className="mt-2 text-sm text-red-500">{message}</p>
            )}
        </form>
    );
}


// export default function Form() {
//   const initialState = { message: null, errors: {} };
//   return (
//     <form>
//       <div className="rounded-md bg-gray-50 p-4 md:p-6">
//         {/* Invoice Amount */}
//         <div className="mb-4">
//           <label htmlFor="amount" className="mb-2 block text-sm font-medium">
//             Upload spreadsheet (.xlsx or .csv)
//           </label>
//             <input
//                 id="file"
//                 name="file"
//                 type="file"
//                 accept=".xlsx, .csv"
//                 className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
//             />
//         </div>
//       </div>
//       <div className="mt-6 flex justify-end gap-4">
//         <Link href="/dashboard/sales" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
//           Cancel
//         </Link>
//         <Button type="submit">Upload Sales</Button>
//       </div>
//     </form>
//   );
// }
