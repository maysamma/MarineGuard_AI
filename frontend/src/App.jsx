import React,{useEffect,useState}from'react';
import{Routes,Route}from'react-router-dom';
import{Sun,Moon,Languages}from'lucide-react';
import{useLanguage}from'./language';
import Layout from'./components/Layout';
import Home from'./pages/Home';
import Dashboard from'./pages/Dashboard';
import Submit from'./pages/Submit';
import Reports from'./pages/Reports';
import Result from'./pages/Result';
import MapPage from'./pages/MapPage';
import Review from'./pages/Review';
import Sensors from'./pages/Sensors';
import Site from'./pages/Site';

function ThemeToggle(){
  const{toggleLanguage}=useLanguage();
  const[darkMode,setDarkMode]=useState(()=>{
    const saved=localStorage.getItem('marineguard-theme');
    return saved?saved==='dark':true;
  });

  useEffect(()=>{
    document.documentElement.classList.toggle('dark',darkMode);
    localStorage.setItem('marineguard-theme',darkMode?'dark':'light');
  },[darkMode]);

  return(
    <>
      <button
        onClick={toggleLanguage}
        aria-label="Switch language"
        title="Switch language"
        className="fixed z-[2000] bottom-[76px] right-5 h-12 w-12 rounded-2xl flex items-center justify-center bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] shadow-lg hover:scale-105 transition-all duration-200"
      >
        <Languages size={19}/>
      </button>

      <button
        onClick={()=>setDarkMode(v=>!v)}
        aria-label={darkMode?'Switch to light mode':'Switch to dark mode'}
        title={darkMode?'Switch to light mode':'Switch to dark mode'}
        className="fixed z-[2000] bottom-5 right-5 h-12 w-12 rounded-2xl flex items-center justify-center bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] shadow-lg hover:scale-105 transition-all duration-200"
      >
        {darkMode?<Sun size={19}/>:<Moon size={19}/>}
      </button>
    </>
  );
}

export default function App(){
  return(
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>

        <Route element={<Layout/>}>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/submit" element={<Submit/>}/>
          <Route path="/reports" element={<Reports/>}/>
          <Route path="/reports/:id" element={<Result/>}/>
          <Route path="/map" element={<MapPage/>}/>
          <Route path="/review" element={<Review/>}/>
          <Route path="/sensors" element={<Sensors/>}/>
          <Route path="/sites/:id" element={<Site/>}/>
        </Route>
      </Routes>

      <ThemeToggle/>
    </>
  );
}
