import React from 'react';

export default function PriorityBadge({level}){
  const cls={
    High:'bg-rose-400/10 text-rose-500 dark:text-rose-300 border-rose-400/20',
    Medium:'bg-amber-400/10 text-amber-600 dark:text-amber-300 border-amber-400/20',
    Low:'bg-emerald-400/10 text-emerald-600 dark:text-emerald-300 border-emerald-400/20',
    'Needs Review':'bg-violet-400/10 text-violet-600 dark:text-violet-300 border-violet-400/20'
  }[level]||'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border)]';

  return(
    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold border ${cls}`}>
      {level||'Needs Review'}
    </span>
  );
}
