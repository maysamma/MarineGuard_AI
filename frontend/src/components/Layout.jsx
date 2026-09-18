import React,{useState}from'react';
import{NavLink,Link,Outlet}from'react-router-dom';
import{
  Waves,
  LayoutDashboard,
  Map,
  PlusCircle,
  ShieldCheck,
  Activity,
  Radio,
  Menu,
  X,
}from'lucide-react';
import{useLanguage}from'../language';

const links=[
  ['/dashboard','dashboard',LayoutDashboard],
  ['/submit','submit',PlusCircle],
  ['/map','map',Map],
  ['/reports','reports',Activity],
  ['/sensors','sensors',Radio],
  ['/review','verification',ShieldCheck],
];

export default function Layout(){
  const[open,setOpen]=useState(false);
  const{t}=useLanguage();

  return(
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">

      <aside
        className={`fixed z-40 inset-y-0 left-0 w-72 border-r border-[var(--border)] bg-[var(--bg-secondary)] p-5 transition-transform ${
          open?'translate-x-0':'-translate-x-full'
        } lg:translate-x-0`}
      >

        <Link to="/" className="flex items-center gap-3 mb-10">
          <div className="h-11 w-11 rounded-2xl bg-ocean-500/15 border border-ocean-500/30 flex items-center justify-center">
            <Waves className="text-ocean-500"/>
          </div>

          <div>
            <div className="font-black tracking-tight text-lg">
              MarineGuard AI
            </div>

            <div className="text-[10px] uppercase tracking-[.2em] soft">
              Marine intelligence
            </div>
          </div>
        </Link>

        <nav className="space-y-2">
          {links.map(([to,label,Icon])=>(
            <NavLink
              key={to}
              onClick={()=>setOpen(false)}
              to={to}
              className={({isActive})=>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ?'bg-ocean-500/15 text-ocean-600 dark:text-ocean-100 border border-ocean-500/20'
                    :'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
                }`
              }
            >
              <Icon size={18}/>
              {t.nav[label]}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-5 left-5 right-5">
          <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/[.03] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"/>
              {t.system.ready}
            </div>

            <p className="text-xs soft mt-2">
              {t.system.flow}
            </p>
          </div>
        </div>

      </aside>

      <button
        onClick={()=>setOpen(!open)}
        className="lg:hidden fixed z-50 top-4 left-4 btn btn-ghost p-2"
      >
        {open?<X/>:<Menu/>}
      </button>

      <main className="lg:ml-72 min-h-screen">
        <Outlet/>
      </main>

    </div>
  );
}
