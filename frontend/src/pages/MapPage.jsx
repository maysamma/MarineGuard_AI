import React,{useEffect,useState}from'react';
import{MapContainer,TileLayer,Marker,Popup}from'react-leaflet';
import L from'leaflet';
import{getMap}from'../services/api';
import{useLanguage}from'../language';

const icon=(level)=>L.divIcon({
  className:'',
  html:`<div style="width:18px;height:18px;border-radius:50%;background:${
    level==='High'?'#fb7185':
    level==='Medium'?'#fbbf24':
    level==='Low'?'#34d399':
    '#a78bfa'
  };border:3px solid var(--map-marker-border);box-shadow:0 0 0 3px var(--map-marker-ring)"></div>`,
  iconSize:[18,18],
  iconAnchor:[9,9]
});

export default function MapPage(){
  const{t}=useLanguage();
  const[data,setData]=useState([]),
  [filter,setFilter]=useState('All');

  useEffect(()=>{
    getMap().then(setData)
  },[]);

  const shown=data.filter(
    x=>filter==='All'||x.priority===filter
  );

  return(
    <div className="h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">

      <div className="px-5 md:px-8 py-4 border-b border-[var(--border)] flex flex-wrap justify-between items-center gap-3 bg-[var(--bg-secondary)]">

        <div>
          <div className="font-black text-xl">
            {t.mapPage.title}
          </div>

          <div className="text-xs soft">
            {t.mapPage.subtitle}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {['All','High','Medium','Low','Needs Review'].map(x=>
            <button
              key={x}
              onClick={()=>setFilter(x)}
              className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                filter===x
                  ? 'bg-ocean-500 text-ocean-950 border-ocean-500'
                  : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] border-[var(--border)] hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              {x==="All"?t.mapPage.all:x==="High"?t.mapPage.high:x==="Medium"?t.mapPage.medium:x==="Low"?t.mapPage.low:t.mapPage.needsReview}</button>
          )}
        </div>

      </div>

      <div className="flex-1 p-3 bg-[var(--bg-primary)]">
        <MapContainer
          center={[21.59,39.15]}
          zoom={10}
          scrollWheelZoom
          className="!rounded-2xl"
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {shown.map(x=>
            <Marker
              key={x.id}
              position={[x.latitude,x.longitude]}
              icon={icon(x.priority)}
            >
              <Popup>
                <div
                  className="text-[var(--text-primary)]"
                  style={{
                    minWidth:220,
                    background:'var(--bg-panel)',
                    color:'var(--text-primary)'
                  }}
                >
                  <b>{x.site_name}</b>

                  <div style={{marginTop:6}}>
                    {x.description}
                  </div>

                  <div style={{marginTop:8}}>
                    <b>{t.mapPage.priority}:</b> {x.priority} · {x.score}/100
                  </div>

                  <div style={{marginTop:10}}>
                    <a
                      href={`/reports/${x.id}`}
                      className="text-ocean-500 font-semibold"
                    >
                      {t.mapPage.openCase}
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

        </MapContainer>
      </div>

    </div>
  );
}
