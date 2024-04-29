'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/app/ui/button';
import { uploadOrders } from '@/app/lib/actions'; // Make sure this function exists and can handle the uploaded data

export default function SalesForm() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        const selectedFile = files && files[0] ? files[0] : null;
        setFile(selectedFile);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) {
            setMessage('No file selected.');
            return;
        }

        setIsUploading(true);
        const reader = new FileReader();
        reader.onload = async (e: ProgressEvent<FileReader>) => {
            // Check if e.target and e.target.result are not null
            const binaryString = e.target?.result;
            if (binaryString) {
                const workbook = XLSX.read(binaryString, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                let jsonData = XLSX.utils.sheet_to_json(worksheet);

                try {
                    // Assuming uploadOrders accepts an array of order records and returns an orderState object
                    const response = await uploadOrders(jsonData);
                    setMessage(response.message || 'Sales data uploaded successfully.');
                } catch (error) {
                    // Handle server-side errors
                    setMessage('Failed to upload sales data.');
                    console.error('Upload error:', error);
                }
            } else {
                // Handle the error scenario where e.target.result is null
                setMessage('Error loading file.');
                console.error('FileReader event target or result is null.');
            }
            setIsUploading(false);
        };
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
            setMessage('Error reading file.');
            setIsUploading(false);
        };
        reader.readAsBinaryString(file);
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
            <div className="mb-6">
                <label htmlFor="file" className="block mb-2 text-md font-semibold text-gray-700">
                    Upload Excel File
                </label>
                <input
                    type="file"
                    id="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="block w-full text-md text-gray-500 file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0 file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <div className="flex justify-end gap-4">
                <button type="submit" disabled={isUploading}
                        className="px-6 py-2 bg-blue-600 text-white text-lg rounded-full
                           hover:bg-blue-700 focus:outline-none focus:ring-2
                           focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50">
                    Upload Sales
                </button>
            </div>
            {message && (
                <div className="mt-2 p-2 text-sm text-red-600 bg-red-100 rounded">
                    <i className="fas fa-exclamation-triangle"></i> {message}
                </div>
            )}
        </form>

    );
}