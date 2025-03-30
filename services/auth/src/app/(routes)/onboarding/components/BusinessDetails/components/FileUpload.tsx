import { Input, Label, ResponsiveImage } from "nextuiq";
import { FiImage } from 'react-icons/fi';

interface FileUploadProps {
    inputValue: string;
    uploadProgress: number;
    onFileChange: (file: File) => void;
    disabled?: boolean;
}

export function FileUpload({ inputValue, uploadProgress, onFileChange, disabled }: FileUploadProps) {
    return (
        <div className="relative w-full group">
            <Input
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) onFileChange(file);
                }}
                className="hidden"
                id="logo-upload"
                disabled={disabled}
            />
            <Label htmlFor="logo-upload" className="block w-full cursor-pointer">
                <div className="relative w-full h-40 border-2 border-dashed rounded-xl bg-[oklch(var(--theme-muted)/0.1)] hover:bg-[oklch(var(--theme-muted)/0.2)] group-hover:border-[oklch(var(--theme-primary))] transition-all duration-300">
                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="absolute inset-0 bg-[oklch(var(--theme-primary)/0.1)] rounded-xl">
                            <div 
                                className="h-full bg-[oklch(var(--theme-primary)/0.2)] rounded-xl transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center justify-center gap-4">
                            {inputValue ? (
                                <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-[oklch(var(--theme-primary)/0.2)] bg-white">
                                    <ResponsiveImage
                                        src={inputValue}
                                        alt="Company logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="p-4 rounded-xl bg-[oklch(var(--theme-muted)/0.2)] group-hover:bg-[oklch(var(--theme-primary)/0.2)] group-hover:scale-110 transition-all duration-300">
                                        <FiImage className="w-8 h-8 text-[oklch(var(--theme-primary))]" />
                                    </div>
                                    <span className="text-sm text-[oklch(var(--theme-muted-foreground)] group-hover:text-[oklch(var(--theme-foreground)] transition-colors">
                                        Click to upload your logo (max 5MB)
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Label>
        </div>
    );
}