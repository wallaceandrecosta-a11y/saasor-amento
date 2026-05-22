'use client';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ children }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !user) {
      router.push('/login');
    }
  }, [isMounted, user, router]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#0B0D12] flex opacity-0">
        <div className="flex-1 flex flex-col ml-64">
          <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0B0D12] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-h-screen transition-all duration-300">
        <Header />
        <main className="flex-1 p-8 max-w-[1400px] w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
