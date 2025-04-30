export default function SearchBar() {
  return (
    <div className="relative max-w-xs">
      <label htmlFor="search" className="sr-only">Search</label>
      <input 
        type="text" 
        id="search" 
        name="search" 
        className="py-2 px-4 ps-11 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500" 
        placeholder="Search..." 
      />
      <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
        <svg className="size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </div>
    </div>
  );
}