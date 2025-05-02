"use client"

import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50">
      {/* Logo Section */}
      <div className="mb-8 flex items-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Cloud
          <span className="text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text">
            Link
          </span>
        </h1>
      </div>

      {/* AI Avatar Section */}
      <div className="relative mb-12">
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 rounded-full blur-2xl opacity-75 animate-pulse" />
        <div className="relative">
          <Image
            src="/mascot.png"
            alt="AI Assistant"
            width={200}
            height={200}
            className="animate-float drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Dashboard Button */}
      <Link
        href="/dashboard"
        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full 
                 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 
                 hover:scale-105 flex items-center gap-2"
      >
        Go to Dashboard
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </Link>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
