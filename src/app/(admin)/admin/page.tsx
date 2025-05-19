'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/admin/dashboard');
  }, [router]);
  
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-teal-500 rounded-full border-t-transparent"></div>
      <span className="ml-2 text-gray-600 dark:text-gray-300">Redirecting to dashboard...</span>
    </div>
  );
}
