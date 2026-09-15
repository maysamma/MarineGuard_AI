import React from 'react';

export default function StatCard({
  label,
  value,
  icon:Icon,
  accent='text-ocean-500'
}){
  return(
    <div className="metric rounded-2xl p-5 transition-colors duration-300">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider soft">
            {label}
          </div>

          <div className="text-3xl font-black mt-2">
            {value}
          </div>
        </div>

        {Icon&&(
          <div className={`h-10 w-10 rounded-xl bg-ocean-500/10 flex items-center justify-center ${accent}`}>
            <Icon size={19}/>
          </div>
        )}
      </div>
    </div>
  );
}
