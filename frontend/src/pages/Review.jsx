import React,{useEffect,useState}from'react';
import{api}from'../services/api';
import{Link}from'react-router-dom';
import{ShieldCheck,Clock,CheckCircle2}from'lucide-react';
import PriorityBadge from'../components/PriorityBadge';

export default function Review(){
  const[q,setQ]=useState([]);

  const load=()=>api.get('/verification').then(r=>setQ(r.data));

  useEffect(load,[]);

  const update=(id,status)=>
    api.patch(`/verification/${id}`,{
      status,
      reviewer:'Hackathon Reviewer',
      notes:
        status==='verified'
          ?'Reviewed against available evidence.'
          :'Requires additional field/approved environmental evidence.'
    }).then(load);

  return(
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">

      <div className="px-5 md:px-8 py-5 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="text-xl font-black">
          {t.review.title}
        </div>

        <div className="text-sm soft mt-1">
          {t.review.subtitle}
        </div>
      </div>

      <div className="p-5 md:p-8 max-w-[1300px] mx-auto space-y-4">

        {q.map(v=>
          <div
            key={v.id}
            className="panel p-5"
          >

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

              <div>

                <div className="flex items-center gap-3">

                  <ShieldCheck
                    size={18}
                    className="text-ocean-500"
                  />

                  <Link
                    className="font-bold hover:text-ocean-500"
                    to={`/reports/${v.report.id}`}
                  >
                    {v.report.site_name}
                  </Link>

                  <PriorityBadge
                    level={v.report.priority?.level}
                  />

                </div>

                <p className="text-sm soft mt-2">
                  {v.report.description}
                </p>

              </div>

              <div className="flex gap-2">

                {v.status!=='under_review'&&
                  <button
                    onClick={()=>update(v.id,'under_review')}
                    className="btn btn-ghost text-xs"
                  >
                    <Clock size={15}/>
                    {t.review.underReview}
                  </button>
                }

                {v.status!=='verified'&&
                  <button
                    onClick={()=>update(v.id,'verified')}
                    className="btn btn-primary text-xs"
                  >
                    <CheckCircle2 size={15}/>
                    {t.review.verify}
                  </button>
                }

              </div>

            </div>

            <div className="mt-4 text-xs soft">
              {t.review.status}: {v.status=== 'under_review' ? t.review.underReview : v.status=== 'verified' ? t.review.verified : v.status}
              {v.notes&&` · ${v.notes}`}
            </div>

          </div>
        )}

        {!q.length&&
          <div className="panel p-12 text-center soft">
            {t.review.noCases}
          </div>
        }

      </div>

    </div>
  );
}
