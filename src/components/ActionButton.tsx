import React from 'react';

interface ActionButtonProps {
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  variant?: 'primary' | 'default' | 'active' | 'emergency';
  onClick: () => void;
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  sublabel,
  icon,
  variant = 'default',
  onClick,
  disabled = false,
}) => {
  const baseClasses =
    'group relative flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-50 cursor-pointer hover:scale-[1.015]';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-cyan-500/25 via-blue-600/20 to-indigo-600/20 border-cyan-400/50 hover:border-cyan-300 shadow-[0_0_24px_rgba(6,182,212,0.22)] hover:shadow-[0_0_32px_rgba(6,182,212,0.38)] text-slate-100',
    default:
      'glass-card hover:border-cyan-400/50 text-slate-100',
    active:
      'bg-cyan-950/60 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.2)] text-cyan-100',
    emergency:
      'bg-gradient-to-r from-rose-950/65 to-orange-950/50 border-rose-500/55 hover:border-rose-400 shadow-[0_0_22px_rgba(244,63,94,0.24)] hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] text-rose-100',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-transform duration-150 group-hover:scale-105 ${
            variant === 'emergency'
              ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
              : variant === 'primary' || variant === 'active'
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40'
              : 'bg-slate-800/90 text-cyan-400 border border-slate-700'
          }`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold tracking-tight whitespace-nowrap truncate">
            {label}
          </div>
          {sublabel && (
            <div className="text-xs text-slate-400 whitespace-nowrap truncate mt-0.5">
              {sublabel}
            </div>
          )}
        </div>
      </div>
    </button>
  );
};
