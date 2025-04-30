interface MobileSearchButtonProps {
  onClick: () => void;
}

export default function MobileSearchButton({ onClick }: MobileSearchButtonProps) {
  return (
    <button
      onClick={onClick}
      className="md:hidden inline-flex flex-shrink-0 justify-center items-center h-9 w-9 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  );
}