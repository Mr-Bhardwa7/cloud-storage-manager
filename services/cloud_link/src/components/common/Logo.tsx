export default function Logo() {
  return (
    <a className="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80" href="#" aria-label="CloudLink">
      <div className="flex items-center gap-2">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M17.5 19H6.5C4.01472 19 2 16.9853 2 14.5C2 12.0147 4.01472 10 6.5 10C6.77637 10 7.04727 10.0235 7.31089 10.0691C7.31029 10.0461 7.31 10.0231 7.31 10C7.31 7.23858 9.54858 5 12.31 5C14.8228 5 16.9037 6.84051 17.2523 9.24191C19.3457 9.72393 20.89 11.5762 20.89 13.8C20.89 16.3196 18.8596 18.35 16.34 18.35"
            stroke="#2563EB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-xl font-bold text-gray-800">CloudLink</span>
      </div>
    </a>
  );
}