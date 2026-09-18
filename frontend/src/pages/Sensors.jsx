import React,{useEffect,useState}from'react';
import{api,getSites}from'../services/api';
import{Radio,TriangleAlert,CheckCircle2}from'lucide-react';
import{useLanguage}from'../language';

export default function Sensors(){
  const{t}=useLanguage();
  const[sites,setSites]=useState([]),
  [readings,setReadings]=useState([]),
  [site,setSite]=useState(''),
  [anomaly,setAnomaly]=useState(false),
  [msg,setMsg]=useState('');

  const load=()=>api.get('/sensors/readings').then(r=>setReadings(r.data));

  useEffect(()=>{
    getSites().then(s=>{
      setSites(s);
      if(s[0])setSite(s[0].id);
    });
    load();
  },[]);

  const simulate=()=>{
    if(!site)return;
    api.post('/sensors/simulate',{
      site_id:Number(site),
      anomaly
    }).then(r=>{
      setMsg(`${t.sensors.generatedReadings} ${r.data.readings.length}`);
      load();
    });
  };

  return(
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">

      <div className="px-5 md:px-8 py-5 border-b border-[var(--border)]">
        <div className="text-xl font-black">{t.sensors.title}</div>
        <div className="text-sm soft mt-1">
          {t.sensors.subtitle}
        </div>
      </div>

      <div className="p-5 md:p-8 max-w-6xl mx-auto space-y-6">

        <div className="panel p-6">

          <div className="flex items-center gap-3">
            <Radio className="text-ocean-500"/>

            <div>
              <h2 className="font-bold">{t.sensors.simulatedSensorData}</h2>
              <p className="text-xs soft mt-1">
                {t.sensors.storedSource}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-6">

            <select
              value={site}
              onChange={e=>setSite(e.target.value)}
              className="bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded-xl p-3 outline-none focus:border-ocean-500 transition-colors"
            >
              {sites.map(s=>
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              )}
            </select>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/[.03] border border-[var(--border)] text-sm transition-colors">
              <input
                type="checkbox"
                checked={anomaly}
                onChange={e=>setAnomaly(e.target.checked)}
                className="accent-ocean-500"
              />
              {t.sensors.simulateAnomaly}
            </label>

            <button
              onClick={simulate}
              className="btn btn-primary"
            >
              {t.sensors.generateReadings}
            </button>

          </div>

          {msg&&
            <div className="mt-4 text-sm text-emerald-600 dark:text-emerald-300 flex gap-2">
              <CheckCircle2 size={16}/>
              {msg}
            </div>
          }

        </div>

        <div className="panel overflow-hidden">

          <div className="p-5 font-bold">
            {t.sensors.recentReadings}
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="text-xs soft bg-black/[.025] dark:bg-white/[.025]">
                <tr>
                  <th className="text-left p-4">{t.sensors.site}</th>
                  <th className="text-left p-4">{t.sensors.sensor}</th>
                  <th className="text-left p-4">{t.sensors.value}</th>
                  <th className="text-left p-4">{t.sensors.source}</th>
                  <th className="text-left p-4">{t.sensors.time}</th>
                </tr>
              </thead>

              <tbody>
                {readings.map(x=>
                  <tr
                    key={x.id}
                    className="border-t border-[var(--border)]"
                  >
                    <td className="p-4">
                      {sites.find(s=>s.id===x.site_id)?.name||x.site_id}
                    </td>

                    <td className="p-4 capitalize">
                      {x.sensor_type}
                    </td>

                    <td className="p-4 font-bold">
                      {x.value} {x.unit}
                    </td>

                    <td className="p-4">
                      <span className="text-amber-600 dark:text-amber-300 text-xs font-bold">
                        {x.source}
                      </span>
                    </td>

                    <td className="p-4 text-xs soft">
                      {new Date(x.timestamp).toLocaleString()}
                    </td>
                  </tr>
                )}
              </tbody>

            </table>

            {!readings.length&&
              <div className="p-10 text-center soft">
                {t.sensors.noReadings}
              </div>
            }

          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-700 dark:text-amber-100 flex gap-2">
          <TriangleAlert size={15}/>
          {t.sensors.warning}
        </div>

      </div>
    </div>
  );
}
