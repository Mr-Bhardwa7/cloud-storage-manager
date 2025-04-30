export default function AddAccountCard() {
  return (
    <button className="p-6 h-full border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center">
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <div className="text-center">
        <span className="text-sm font-medium text-gray-900">Add New Account</span>
        <p className="text-xs text-gray-500 mt-1">Connect with Google Drive, Dropbox, or others</p>
      </div>
    </button>
  );
}