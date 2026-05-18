import React from 'react';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorInput = ({ label, value, onChange }: ColorInputProps) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">{label}</label>
    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
      <input 
        type="color" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded-lg border-none bg-transparent cursor-pointer"
      />
      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{value}</span>
    </div>
  </div>
);
