'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-black mb-4">Test Page</h1>
        <p className="text-gray-600">This is a simple test page to verify routing works.</p>
        <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
          <p className="text-green-800">✅ If you can see this, the page is loading correctly!</p>
        </div>
      </div>
    </div>
  );
}