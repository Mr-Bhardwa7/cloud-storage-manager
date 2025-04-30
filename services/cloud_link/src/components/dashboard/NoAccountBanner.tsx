'use client';

import Image from 'next/image';
import Link from 'next/link';
import { IoArrowForward } from 'react-icons/io5';

export default function NoAccountBanner() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 relative">
        <Image
          src="/mascot.png"
          alt="AI Assistant"
          width={220}
          height={220}
          className="animate-bounce-gentle"
        />
        <div className="absolute -right-2 top-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
          <span className="text-yellow-600 text-xl">✨</span>
        </div>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
         Let's Connect Your Cloud Storage
        </h2>
        <p className="text-gray-600">
          I noticed you haven't connected any storage accounts yet. 
          Let me help you get started with your favorite providers!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button className="flex items-center px-6 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all group">
          <Image 
            src="/google-drive.svg" 
            alt="Google Drive" 
            width={24} 
            height={24} 
            className="mr-3" 
          />
          <span className="text-gray-700 group-hover:text-gray-900">Connect Google Drive</span>
        </button>
        
        <button className="flex items-center px-6 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all group">
          <Image 
            src="/dropbox.svg" 
            alt="Dropbox" 
            width={24} 
            height={24} 
            className="mr-3" 
          />
          <span className="text-gray-700 group-hover:text-gray-900">Connect Dropbox</span>
        </button>
      </div>

      <Link 
        href="/settings" 
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
      >
        See other storage options
        <IoArrowForward className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}