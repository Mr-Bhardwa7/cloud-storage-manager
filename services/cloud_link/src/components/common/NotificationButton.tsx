export default function NotificationButton() {
  return (
    <button type="button" className="inline-flex flex-shrink-0 justify-center items-center h-10 w-10 rounded-lg text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
      <span className="flex relative">
        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        <span className="absolute top-0 end-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">2</span>
      </span>
    </button>
  );
}