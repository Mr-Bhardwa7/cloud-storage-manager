interface FormInputProps {
  label: string;
  type: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  disabled?: boolean;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  rows?: number; // Add rows prop for textarea
}

export default function FormInput({ 
  label, 
  type, 
  value, 
  onChange, 
  disabled, 
  required,
  options,
  rows = 3 // Default value for textarea rows
}: FormInputProps) {
  const baseClassName = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  
  if (type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea
          rows={rows}
          value={value}
          onChange={onChange}
          className={`${baseClassName} ${disabled ? 'bg-gray-50 text-gray-500' : ''}`}
          disabled={disabled}
          required={required}
        />
      </div>
    );
  }

  if (type === 'select' && options) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <select 
          value={value} 
          onChange={onChange}
          className={`${baseClassName} ${disabled ? 'bg-gray-50 text-gray-500' : ''}`}
          disabled={disabled}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`${baseClassName} ${disabled ? 'bg-gray-50 text-gray-500' : ''}`}
        disabled={disabled}
        required={required}
      />
    </div>
  );
}