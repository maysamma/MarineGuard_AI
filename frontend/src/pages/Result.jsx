import React,{useEffect,useState}from'react';
import{useParams,Link}from'react-router-dom';
import{getReport,getRuns,imageUrl}from'../services/api';
import{ArrowLeft,ShieldAlert,Database,Radio,History,Users,MapPin,CheckCircle2}from'lucide-react';
import PriorityBadge from'../components/PriorityBadge';
import AgentTrace from'../components/AgentTrace';
import{useLanguage}from'../language';

export default function Result(){
  const{t}=useLanguage();
  const{id}=useParams();
  const[r,setR]=useState(null),[runs,setRuns]=useState([]);

  useEffect(()=>{
    getReport(id).then(setR);
    getRuns(id).then(setRuns);
  },[id]);

  if(!r)
    return <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-10 soft">{t.result.loading}</div>;

  const evidence=r.evidence||{};
  const imageEvidence=evidence.image||{};
  const sensorEvidence=evidence.sensors||{};
  const historicalEvidence=evidence.historical||{};
  const communityEvidence=evidence.community||{};
  const locationEvidence=evidence.location||{};

  const evidenceItems=[
    {
      icon:Database,
      label:t.result.imageEvidence,
      value:imageEvidence.available
        ?`${t.result.available}${imageEvidence.status?` · ${imageEvidence.status}`:''}`
        :t.result.missing
    },
    {
      icon:Radio,
      label:t.result.sensorEvidence,
      value:sensorEvidence.available
        ?`${sensorEvidence.count} ${t.result.readings} · ${sensorEvidence.sources?.join(',')||t.result.unknownSource}`
        :t.result.noReadings
    },
    {
      icon:MapPin,
      label:t.result.location,
      value:locationEvidence.available
        ?`${Number(locationEvidence.latitude).toFixed(4)}, ${Number(locationEvidence.longitude).toFixed(4)}`
        :t.result.missing
    },
    {
      icon:History,
      label:t.result.historicalEvidence,
      value:historicalEvidence.available
        ?`${historicalEvidence.count} ${t.result.observations}`
        :t.result.noHistoricalObservations
    },
    {
      icon:Users,
      label:t.result.communityEvidence,
      value:communityEvidence.available
        ?`${communityEvidence.count} ${t.result.additionalReports}`
        :t.result.noAdditionalCommunityReports
    }
  ];

  return(
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 p-5 md:p-8 max-w-[1450px] mx-auto">

      <Link
        to="/reports"
        className="text-sm soft flex items-center gap-2 mb-5 hover:text-ocean-500 transition-colors"
      >
        <ArrowLeft size={15}/>
        {t.result.backToReports}
      </Link>

      <div className="grid xl:grid-cols-[1.2fr_.8fr] gap-6">

        <div className="space-y-6">

          <div className="panel overflow-hidden">

            <div className="aspect-[16/9] bg-[var(--bg-primary)]">
              {r.image?
                <img
                  src={imageUrl(r.image.url)}
                  className="w-full h-full object-cover"
                  alt={r.site_name||t.result.marineObservation}
                />
                :
                <div className="h-full flex items-center justify-center soft">
                  {t.result.noImageEvidence}
                </div>
              }
            </div>

            <div className="p-6">

              <div className="flex flex-wrap items-center justify-between gap-3">

                <div>
                  <div className="text-xs soft uppercase tracking-wider">
                    {t.result.observation} #{r.id}
                  </div>

                  <h1 className="text-2xl font-black mt-1">
                    {r.site_name}
                  </h1>
                </div>

                <PriorityBadge level={r.priority?.level}/>

              </div>

              <p className="mt-4 soft leading-relaxed">
                {r.description}
              </p>

              <div className="grid sm:grid-cols-3 gap-3 mt-5">

                <div className="p-3 rounded-xl bg-black/[.03] dark:bg-white/[.03] border border-[var(--border)]">
                  <MapPin size={15} className="text-ocean-500"/>
                  <div className="text-xs soft mt-2">{t.result.location}</div>
                  <div className="text-sm font-semibold mt-1">
                    {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/[.03] dark:bg-white/[.03] border border-[var(--border)]">
                  <Users size={15} className="text-ocean-500"/>
                  <div className="text-xs soft mt-2">{t.result.community}</div>
                  <div className="text-sm font-semibold mt-1">
                    {communityEvidence.count||0} {t.result.additionalReports}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/[.03] dark:bg-white/[.03] border border-[var(--border)]">
                  <History size={15} className="text-ocean-500"/>
                  <div className="text-xs soft mt-2">{t.result.history}</div>
                  <div className="text-sm font-semibold mt-1">
                    {historicalEvidence.count||0} {t.result.observations}
                  </div>
                </div>

              </div>

            </div>
          </div>

          <div className="panel p-6">

            <div className="flex items-center gap-2">
              <ShieldAlert className="text-ocean-500"/>
              <h2 className="font-bold">{t.result.aiVisualFindings}</h2>
            </div>

            {r.ai?
              <>
                <div className="mt-5 space-y-3">

                  {r.ai.indicators.length?
                    r.ai.indicators.map((i,n)=>
                      <div
                        key={n}
                        className="p-4 rounded-xl bg-black/[.03] dark:bg-white/[.03] border border-[var(--border)]"
                      >
                        <div className="flex justify-between gap-3">
                          <div className="font-semibold capitalize">
                            {i.type.replaceAll('_',' ')}
                          </div>

                          <div className="text-ocean-500 font-bold">
                            {Math.round(i.confidence*100)}%
                          </div>
                        </div>

                        <div className="text-xs soft mt-2">
                          {i.explanation||`${t.result.status}: ${i.status}`}
                        </div>
                      </div>
                    )
                    :
                    <div className="p-4 rounded-xl bg-violet-400/10 border border-violet-400/20 text-sm">
                      {t.result.reliableIndicatorMissing}
                    </div>
                  }

                </div>

                <div className="mt-4 text-sm">
                  <span className="font-bold">{t.result.confidence}:</span>{' '}
                  {Math.round(r.ai.confidence*100)}% · {r.ai.summary}
                </div>

                <div className="mt-3 p-4 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-800 dark:text-amber-100">
                  {t.result.limitation}: {r.ai.limitations}
                </div>
              </>
              :
              <div className="soft text-sm mt-5">
                {t.result.analysisNotAvailable}
              </div>
            }

          </div>

        </div>

        <div className="space-y-6">

          <div className="panel p-6">

            <h2 className="font-bold">
              {t.result.priorityAssessment}
            </h2>

            <div className="flex items-end gap-3 mt-5">
              <div className="text-6xl font-black text-ocean-500">
                {r.priority?.score??'—'}
              </div>

              <div className="text-sm soft mb-2">
                {t.result.internalOperationalIndex}
              </div>
            </div>

            <PriorityBadge level={r.priority?.level}/>

            <div className="mt-5 space-y-2">
              {(r.priority?.reasons||[]).map((x,i)=>
                <div key={i} className="flex gap-2 text-sm">
                  <CheckCircle2 size={16} className="text-ocean-500 mt-0.5 shrink-0"/>
                  {x}
                </div>
              )}
            </div>

            <div className="mt-5 text-xs soft">
              {t.result.priorityDisclaimer}
            </div>

          </div>

          <div className="panel p-6">

            <h2 className="font-bold">
              {t.result.evidencePackage}
            </h2>

            <div className="mt-4 space-y-2">

              {evidenceItems.map(({icon:Icon,label,value})=>(
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl bg-black/[.03] dark:bg-white/[.03] border border-[var(--border)]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon size={16} className="text-ocean-500 shrink-0"/>
                    <span className="text-sm">
                      {label}
                    </span>
                  </div>

                  <span className="text-xs soft text-right">
                    {value}
                  </span>
                </div>
              ))}

            </div>

          </div>

          <div className="panel p-6">

            <h2 className="font-bold">
              {t.result.recommendation}
            </h2>

            <div className="text-xl font-black mt-4">
              {r.recommendation?.action||t.result.needsReview}
            </div>

            <p className="text-sm soft mt-2 leading-relaxed">
              {r.recommendation?.rationale}
            </p>

          </div>

          <div className="panel p-6">

            <h2 className="font-bold mb-4">
              {t.result.agentExecutionTrace}
            </h2>

            <AgentTrace runs={runs}/>

          </div>

        </div>

      </div>

    </div>
  );
}
