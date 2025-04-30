import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
}

// Add mock data (replace with real data later)
const recentAccounts = [
  { id: 1, name: 'Google Drive', email: 'user@gmail.com', provider: 'google', status: 'Linked' },
  { id: 2, name: 'Dropbox', email: 'user@outlook.com', provider: 'dropbox', status: 'Linked' },
  { id: 3, name: 'Amazon S3', email: '', provider: 'aws', status: 'Linked' },
];

const commands = [
  { id: 1, name: 'Link new account', icon: 'M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25' },
  { id: 2, name: 'Unlink Google Drive', icon: 'M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25' },
  { id: 3, name: 'View account details', icon: 'M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z' },
];

export default function Spotlight({ isOpen, onClose }: SpotlightProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (!isOpen) onClose();
      } else if (event.key === 'ArrowDown') {
        setActiveIndex(prev => Math.min(prev + 1, recentAccounts.length + commands.length - 1));
      } else if (event.key === 'ArrowUp') {
        setActiveIndex(prev => Math.max(prev - 1, 0));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 translate-y-4"
            enterTo="opacity-100 translate-y-0"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-4"
          >
            <Dialog.Panel className="mx-auto max-w-2xl transform overflow-hidden rounded-2xl bg-white/90 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl transition-all">
              <div className="relative">
                <div className="flex items-center gap-3 border-b border-gray-200/20 px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10">
                    <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="flex-1 bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
                    placeholder="Search anything..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <kbd className="hidden rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 sm:inline-block">⌘K</kbd>
                    <button
                      onClick={onClose}
                      className="rounded-lg p-1 hover:bg-gray-100"
                    >
                      <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                        <path d="M6 6l8 8m0-8l-8 8" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto overscroll-contain px-2 pb-2">
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 py-4"
                    >
                      {/* Cloud Accounts */}
                      <div className="px-2">
                        <div className="mb-3 flex items-center justify-between">
                          <h2 className="text-xs font-semibold text-gray-500">Cloud Accounts</h2>
                          <span className="text-xs text-gray-400">Tab to navigate</span>
                        </div>
                        <div className="space-y-1">
                          {recentAccounts.map((account, index) => (
                            <motion.button
                              key={account.id}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              className={`
                                group relative w-full rounded-lg p-3 text-left transition-colors
                                ${activeIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'}
                              `}
                            >
                              <div className="flex items-center gap-3">
                                {/* ... keep existing provider icons ... */}
                                <div className="flex-1 overflow-hidden">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-900">{account.name}</span>
                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                      {account.status}
                                    </span>
                                  </div>
                                  {account.email && (
                                    <p className="truncate text-sm text-gray-500">{account.email}</p>
                                  )}
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Commands */}
                      <div className="px-2">
                        <div className="mb-3 flex items-center justify-between">
                          <h2 className="text-xs font-semibold text-gray-500">Quick Actions</h2>
                          <span className="text-xs text-gray-400">⌘1-9 to select</span>
                        </div>
                        <div className="space-y-1">
                          {commands.map((command, index) => (
                            <motion.button
                              key={command.id}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              className={`
                                group relative w-full rounded-lg p-3 text-left transition-colors
                                ${activeIndex === index + recentAccounts.length ? 'bg-blue-50' : 'hover:bg-gray-50'}
                              `}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                                  <svg className="h-4 w-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={command.icon} />
                                  </svg>
                                </div>
                                <span className="flex-1 font-medium text-gray-700">{command.name}</span>
                                <kbd className="hidden rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 group-hover:inline-block">
                                  ⌘{index + 1}
                                </kbd>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}