export default function UserDropdown() {
  return (
    <div className="hs-dropdown relative inline-flex">
      <button type="button" className="inline-flex flex-shrink-0 justify-center items-center h-10 w-10 rounded-lg text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <img className="inline-block size-8 rounded-full" src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80" alt="Profile" />
      </button>
      <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2 mt-2 end-0">
        <div className="py-3 px-5 -m-2 bg-gray-100 rounded-t-lg">
          <p className="text-sm text-gray-500">Signed in as</p>
          <p className="text-sm font-medium text-gray-800">james@site.com</p>
        </div>
        <div className="mt-2 py-2 first:pt-0 last:pb-0">
          <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100" href="#">
            Profile
          </a>
          <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100" href="#">
            Settings
          </a>
          <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100" href="#">
            Sign out
          </a>
        </div>
      </div>
    </div>
  );
}