import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function ThankYouPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const score = searchParams.get('score');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4">Application Submitted!</h1>
      <p className="text-lg text-center mb-8">
        Thank you for your application. We have received it successfully.
      </p>
      {score && (
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg mb-8">
          <p className="text-xl font-semibold text-blue-800 dark:text-blue-200">
            Your resume match score: {score}%
          </p>
        </div>
      )}
      <button
        onClick={() => router.push('/')}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Return to Homepage
      </button>
    </div>
  );
}