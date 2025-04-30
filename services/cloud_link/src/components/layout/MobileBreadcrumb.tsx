interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

interface MobileBreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function MobileBreadcrumb({ items }: MobileBreadcrumbProps) {
  return (
    <div className="sticky top-0 inset-x-0 z-20 bg-white border-y border-gray-200 px-4 sm:px-6 lg:px-8 lg:hidden">
      <div className="flex items-center py-2">
        <button 
          type="button" 
          className="size-8 flex justify-center items-center gap-x-2 border border-gray-200 text-gray-800 hover:text-gray-500 rounded-lg focus:outline-hidden focus:text-gray-500"
          data-hs-overlay="#hs-application-sidebar"
        >
          <span className="sr-only">Toggle Navigation</span>
          <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="M15 3v18"/>
            <path d="m8 9 3 3-3 3"/>
          </svg>
        </button>

        <ol className="ms-3 flex items-center whitespace-nowrap">
          {items.map((item, index) => (
            <li key={item.label} className="flex items-center text-sm">
              <a 
                href={item.href}
                className={item.current ? 'font-semibold text-gray-800' : 'text-gray-800'}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.label}
              </a>
              {index < items.length - 1 && (
                <svg className="size-2.5 text-gray-400 mx-3" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}