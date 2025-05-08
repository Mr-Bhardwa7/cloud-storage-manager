interface FormInputProps {
  label: string;
  type: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  disabled?: boolean;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  error?: string;
}

export default function FormInput({ 
  label, 
  type, 
  value, 
  onChange, 
  disabled, 
  required,
  options,
  rows = 3,
  error
}: FormInputProps) {
  const baseClassName = "mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  const inputClassName = `${baseClassName} ${
    error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300'
  } ${disabled ? 'bg-gray-50 text-gray-500' : ''}`;
  
  const renderError = () => {
    if (error) {
      return <p className="mt-1 text-sm text-red-600">{error}</p>;
    }
    return null;
  };

  if (type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea
          rows={rows}
          value={value}
          onChange={onChange}
          className={inputClassName}
          disabled={disabled}
          required={required}
        />
        {renderError()}
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
          className={inputClassName}
          disabled={disabled}
          required={required}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {renderError()}
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
        className={inputClassName}
        disabled={disabled}
        required={required}
      />
      {renderError()}
    </div>
  );
}