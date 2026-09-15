import React from 'react';
import{Link}from'react-router-dom';
import{Plus,Globe2}from'lucide-react';

export default function Topbar({title,subtitle}){
  return(
    <header className="px-5 md:px-8 py-5 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--bg-secondary)] transition-colors duration-300">
      <div>
        <div className="text-xl font-black">
          {title}
        </div>

        {subtitle&&(
          <div className="text-sm soft mt-1">
            {subtitle}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Link
          to="/map"
          className="btn btn-ghost text-sm"
        >
          <Globe2 size={16}/>
          Explore map
        </Link>

        <Link
          to="/submit"
          className="btn btn-primary text-sm"
        >
          <Plus size={16}/>
          New observation
        </Link>
      </div>
    </header>
  );
}
