'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function Scheduling() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Scheduling</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">
              Scheduling page is temporarily simplified while fixing syntax errors. 
              Full functionality will be restored shortly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}