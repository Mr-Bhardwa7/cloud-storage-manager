import Image from 'next/image';

interface ImageUploadProps {
  label: string;
  preview: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isRounded?: boolean;
}

export default function ImageUpload({ label, preview, onImageUpload, isRounded = false }: ImageUploadProps) {
  return (
    <div className="w-32">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative rounded-lg border-2 border-dashed border-gray-300 p-2 hover:border-blue-500 cursor-pointer">
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          accept="image/*"
          onChange={onImageUpload}
        />
        <div className={`h-24 w-24 mx-auto bg-gray-100 overflow-hidden ${isRounded ? 'rounded-full' : 'rounded-lg'}`}>
          {preview ? (
            <Image 
              src={preview}
              alt={`${label} preview`}
              className="h-full w-full object-cover"
              width={200}
              height={200}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400">
              <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRounded ? 
                  "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" :
                  "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"} />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}