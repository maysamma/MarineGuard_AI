import React,{useEffect,useState}from'react';
import{api,getSites}from'../services/api';
import{Radio,TriangleAlert,CheckCircle2}from'lucide-react';

export default function Sensors(){
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
      setMsg(`Generated ${r.data.readings.length} simulated readings.`);
      load();
    });
  };

  return(
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">

      <div className="px-5 md:px-8 py-5 border-b border-[var(--border)]">
        <div className="text-xl font-black">Sensor simulator</div>
        <div className="text-sm soft mt-1">
          IoT-ready ingestion without pretending physical sensors are connected.
        </div>
      </div>

      <div className="p-5 md:p-8 max-w-6xl mx-auto space-y-6">

        <div className="panel p-6">

          <div className="flex items-center gap-3">
            <Radio className="text-ocean-500"/>

            <div>
              <h2 className="font-bold">SIMULATED SENSOR DATA</h2>
              <p className="text-xs soft mt-1">
                Every generated reading is stored with source = simulated.
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
              Simulate anomaly
            </label>

            <button
              onClick={simulate}
              className="btn btn-primary"
            >
              Generate readings
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
            Recent readings
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="text-xs soft bg-black/[.025] dark:bg-white/[.025]">
                <tr>
                  <th className="text-left p-4">Site</th>
                  <th className="text-left p-4">Sensor</th>
                  <th className="text-left p-4">Value</th>
                  <th className="text-left p-4">Source</th>
                  <th className="text-left p-4">Time</th>
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
                No readings yet.
              </div>
            }

          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-700 dark:text-amber-100 flex gap-2">
          <TriangleAlert size={15}/>
          Simulated values are for workflow demonstration and must not be represented as measurements from real sensors.
        </div>

      </div>
    </div>
  );
}
