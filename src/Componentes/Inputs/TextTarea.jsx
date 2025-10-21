import React from "react";

export const TextTarea = ({
  label,
  name,
  value,
  onChange,
  placeholder = "Escribe aquí...",
  rows = 4,
  maxLength,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="p-3 border border-gray-300 rounded-lg resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700"
      />
      {maxLength && (
        <p className="text-xs text-gray-500 text-right">
          {value?.length || 0}/{maxLength}
        </p>
      )}
    </div>
  );
};
