import React,{useState}from'react';
import{UploadCloud,MapPin,ArrowRight,CheckCircle2,Loader2}from'lucide-react';
import{MapContainer,TileLayer,Marker,useMapEvents}from'react-leaflet';
import{api}from'../services/api';
import{useNavigate}from'react-router-dom';

function LocationPicker({position,onChange}){
  useMapEvents({
    click(e){
      onChange([e.latlng.lat,e.latlng.lng]);
    }
  });

  return position?<Marker position={position}/>:null;
}

export default function Submit(){
  const nav=useNavigate();
  const[file,setFile]=useState(null),
  [preview,setPreview]=useState(''),
  [form,setForm]=useState({
    description:'',
    latitude:'21.5433',
    longitude:'39.1728',
    observation_type:'general',
    depth_m:''
  }),
  [step,setStep]=useState('idle'),
  [error,setError]=useState('');

  const position=[
    Number(form.latitude),
    Number(form.longitude)
  ];

  const onLocationChange=([latitude,longitude])=>{
    setForm({
      ...form,
      latitude:latitude.toFixed(6),
      longitude:longitude.toFixed(6)
    });
  };

  const onFile=e=>{
    const f=e.target.files?.[0];
    if(!f)return;
    if(!['image/jpeg','image/png','image/webp'].includes(f.type)){
      setError('Please upload JPG, PNG or WebP.');
      return
    }
    setError('');
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit=async()=>{
    try{
      setStep('uploading');
      const r=await api.post('/reports',{
        ...form,
        latitude:Number(form.latitude),
        longitude:Number(form.longitude),
        depth_m:form.depth_m?Number(form.depth_m):null
      });

      await api.post(
        `/reports/${r.data.id}/image`,
        (()=>{
          const fd=new FormData();
          fd.append('file',file);
          return fd
        })(),
        {headers:{'Content-Type':'multipart/form-data'}}
      );

      setStep('analyzing');
      await api.post(`/reports/${r.data.id}/analyze`);
      setStep('done');
      setTimeout(()=>nav(`/reports/${r.data.id}`),500);
    }catch(e){
      setStep('idle');
      setError(
        e?.response?.data?.detail||
        'Could not complete the report. Check that the backend is running.'
      );
    }
  };

  return(
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">

      <div className="px-5 md:px-8 py-6 border-b border-[var(--border)]">
        <div className="text-xl font-black">Submit a marine observation</div>
        <div className="text-sm soft mt-1">
          Create a real database record, upload evidence, and run the agentic workflow.
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-5 md:p-8">

        <div className="grid lg:grid-cols-2 gap-6">

          <div className="panel p-6">
            <div className="text-sm font-bold mb-4">
              01 · Image evidence
            </div>

            <label className="block aspect-video rounded-2xl border border-dashed border-ocean-500/30 bg-ocean-500/[.03] overflow-hidden cursor-pointer">
              {preview?
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                />
                :
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="h-14 w-14 rounded-2xl bg-ocean-500/10 text-ocean-500 flex items-center justify-center">
                    <UploadCloud/>
                  </div>

                  <div className="font-bold mt-4">
                    Drop or select a marine image
                  </div>

                  <div className="text-xs soft mt-2">
                    JPG, JPEG, PNG, WebP · max 10 MB
                  </div>
                </div>
              }

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onFile}
              />
            </label>

            {file&&
              <div className="mt-3 text-xs soft">
                {file.name} · ready for analysis
              </div>
            }
          </div>

          <div className="panel p-6">
            <div className="text-sm font-bold mb-4">
              02 · Observation context
            </div>

            <div className="space-y-4">

              <div>
                <label className="text-xs soft">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={e=>setForm({...form,description:e.target.value})}
                  placeholder="What did you observe?"
                  className="w-full mt-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded-xl p-3 min-h-28 outline-none focus:border-ocean-500 placeholder:text-[var(--text-muted)] transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <label className="text-xs soft">
                      Observation location
                    </label>

                    <div className="text-xs soft mt-1">
                      Click on the map to select the location.
                    </div>
                  </div>

                  <MapPin size={18} className="text-ocean-500"/>
                </div>

                <div className="mt-3 h-72 rounded-2xl overflow-hidden border border-[var(--border)]">
                  <MapContainer
                    center={position}
                    zoom={10}
                    scrollWheelZoom
                    className="h-full w-full"
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <LocationPicker
                      position={position}
                      onChange={onLocationChange}
                    />
                  </MapContainer>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">

                  <div>
                    <label className="text-xs soft">
                      Latitude
                    </label>

                    <input
                      value={form.latitude}
                      readOnly
                      className="w-full mt-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded-xl p-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs soft">
                      Longitude
                    </label>

                    <input
                      value={form.longitude}
                      readOnly
                      className="w-full mt-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded-xl p-3 outline-none"
                    />
                  </div>

                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="text-xs soft">
                    Observation type
                  </label>

                  <select
                    value={form.observation_type}
                    onChange={e=>setForm({...form,observation_type:e.target.value})}
                    className="w-full mt-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded-xl p-3 outline-none focus:border-ocean-500 transition-colors"
                  >
                    <option value="general">general</option>
                    <option value="marine_debris">marine_debris</option>
                    <option value="water_appearance">water_appearance</option>
                    <option value="coral_condition">coral_condition</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs soft">
                    Depth (optional)
                  </label>

                  <input
                    value={form.depth_m}
                    onChange={e=>setForm({...form,depth_m:e.target.value})}
                    placeholder="m"
                    className="w-full mt-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded-xl p-3 outline-none focus:border-ocean-500 placeholder:text-[var(--text-muted)] transition-colors"
                  />
                </div>

              </div>
            </div>
          </div>

        </div>

        {error&&
          <div className="mt-5 p-4 rounded-xl bg-rose-400/10 border border-rose-400/20 text-rose-600 dark:text-rose-200 text-sm">
            {error}
          </div>
        }

        <div className="mt-6 panel p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <MapPin className="text-ocean-500"/>

            <div>
              <div className="font-bold">
                Location is evidence
              </div>

              <div className="text-xs soft">
                Use the observation coordinates; do not infer sensitive site context.
              </div>
            </div>
          </div>

          <button
            disabled={!file||step!=='idle'}
            onClick={submit}
            className="btn btn-primary disabled:opacity-40"
          >
            {step==='idle'?
              <>
                Run agentic analysis
                <ArrowRight size={17}/>
              </>
              :
              step==='done'?
              <>
                <CheckCircle2 size={17}/>
                Complete
              </>
              :
              <>
                <Loader2 size={17} className="animate-spin"/>
                Processing…
              </>
            }
          </button>

        </div>
      </div>
    </div>
  );
}
