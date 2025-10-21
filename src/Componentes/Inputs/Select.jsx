import React from "react";

export const Select = ({
  label,
  options = [],
  value,
  onChange,
  name,
  placeholder = "Selecciona una opción",
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
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm text-gray-700"
      >
        <option value="">{placeholder}</option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
