'use client';

import React, { useState, useEffect } from 'react';

interface CurrencyInputFieldProps {
  value: number;
  onChange: (val: number) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
}

export const CurrencyInputField: React.FC<CurrencyInputFieldProps> = ({
  value,
  onChange,
  label,
  placeholder = '0.00',
  disabled = false,
  required = false,
  className = '',
  id,
}) => {
  const formatDisplay = (num: number): string => {
    if (num === undefined || num === null || isNaN(num) || num === 0) return '';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const [displayValue, setDisplayValue] = useState<string>(formatDisplay(value));

  useEffect(() => {
    setDisplayValue(formatDisplay(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    const parts = raw.split('.');
    if (parts.length > 2) return;

    setDisplayValue(e.target.value);
    const parsed = parseFloat(raw);
    onChange(isNaN(parsed) ? 0 : parsed);
  };

  const handleBlur = () => {
    setDisplayValue(formatDisplay(value));
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="font-bold text-slate-700 block text-xs uppercase tracking-wider">
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-2xs">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600 font-black text-sm select-none">
          ₱
        </div>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          disabled={disabled}
          required={required}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white text-slate-900 font-extrabold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
};
