import React,{useEffect,useState}from'react';
import{useParams,Link}from'react-router-dom';
import{getSite}from'../services/api';
import{ArrowLeft,MapPin}from'lucide-react';
import{useLanguage}from'../language';

export default function Site(){
  const{t}=useLanguage();
  const{id}=useParams();
  const[s,setS]=useState(null);

  useEffect(()=>{
    getSite(id).then(setS);
  },[id]);

  if(!s)
    return(
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-10 soft">
        {t.site.loading}
      </div>
    );

  const timeline=[
    ...s.history,
    ...s.reports.map(r=>({
      type:'community_report',
      created_at:r.created_at,
      evidence:{description:r.description}
    }))
  ].sort(
    (a,b)=>new Date(a.created_at)-new Date(b.created_at)
  );

  return(
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <div className="p-5 md:p-8 max-w-6xl mx-auto">

        <Link
          to="/map"
          className="text-sm soft flex items-center gap-2 mb-5 hover:text-ocean-500 transition-colors"
        >
          <ArrowLeft size={15}/>
          {t.site.backToMap}
        </Link>

        <div className="panel p-6">

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-ocean-500/10 text-ocean-500 flex items-center justify-center shrink-0">
              <MapPin size={22}/>
            </div>

            <div>
              <h1 className="text-2xl font-black">
                {s.site.name}
              </h1>

              <div className="text-sm soft mt-1">
                {s.site.latitude.toFixed(4)}, {s.site.longitude.toFixed(4)}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="font-bold">
              {t.site.observationTimeline}
            </h2>

            <div className="mt-4 space-y-3">
              {timeline.map((x,i)=>(
                <div
                  key={i}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                >
                  <div className="sm:w-24 text-xs soft pt-1 shrink-0">
                    {new Date(x.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex-1 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                    <div className="font-semibold capitalize">
                      {x.type.replaceAll('_',' ')}
                    </div>

                    <div className="text-xs soft mt-1">
                      {x.source||t.site.marineGuard}
                    </div>

                    <div className="text-sm soft mt-2">
                      {x.evidence?.description||
                       x.evidence?.note||
                       t.site.observationStored}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!timeline.length&&(
              <div className="mt-4 p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center soft">
                {t.site.noObservations}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
