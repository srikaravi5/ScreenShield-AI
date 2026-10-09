import React from 'react';

interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <section className="p-5 sm:p-6 rounded-xl bg-slate-900/70 border border-slate-800/90 space-y-5">
      <div className="border-b border-slate-800/80 pb-3.5">
        <h2 className="text-base font-semibold text-slate-100">{title}</h2>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
      <div className="divide-y divide-slate-800/60">{children}</div>
    </section>
  );
};

interface SettingRowProps {
  label: string;
  description?: string;
  control: React.ReactNode;
}

export const SettingRow: React.FC<SettingRowProps> = ({
  label,
  description,
  control,
}) => {
  return (
    <div className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div className="text-sm font-medium text-slate-200">{label}</div>
        {description && (
          <div className="text-xs text-slate-400 mt-0.5">{description}</div>
        )}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
};
