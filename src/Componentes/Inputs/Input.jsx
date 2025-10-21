import React from 'react';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  error = '',
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="mb-2 text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 
          outline-none focus:ring-4
          ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'}
          ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          }
        `}
        {...props}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
