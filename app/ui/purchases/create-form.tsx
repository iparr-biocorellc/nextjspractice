'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/app/ui/button';
import { uploadPurchases } from '@/app/lib/actions'; // Make sure this function exists and can handle the uploaded data

export default function PurchasesForm() {
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
                    const response = await uploadPurchases(jsonData);
                    setMessage(response.message || 'Purchases data uploaded successfully.');
                } catch (error) {
                    // Handle server-side errors
                    setMessage('Failed to upload purchases data.');
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
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="file" className="block mb-2 text-sm font-medium">
                    Upload Excel File
                </label>
                <input
                    type="file"
                    id="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-900 border-gray-300 rounded-lg cursor-pointer focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Button type="submit" disabled={isUploading}>Upload Purchases</Button>
            </div>
            {message && (
                <p className="mt-2 text-sm text-red-500">{message}</p>
            )}
        </form>
    );
}