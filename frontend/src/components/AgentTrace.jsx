import React from 'react';
import{CheckCircle2,Loader2,AlertCircle}from'lucide-react';
import{useLanguage}from'../language';

export default function AgentTrace({runs=[]}){
  const{t}=useLanguage();
  return(
    <div className="space-y-2">
      {runs.length===0?(
        <div className="text-sm soft p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
          {t.agentTrace.runAnalysis}
        </div>
      ):(
        runs.map(r=>(
          <div
            key={r.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] transition-colors"
          >
            <div className="mt-0.5 shrink-0">
              {r.status==='completed'?(
                <CheckCircle2 size={17} className="text-emerald-400"/>
              ):r.status==='running'?(
                <Loader2 size={17} className="animate-spin text-ocean-500"/>
              ):(
                <AlertCircle size={17} className="text-amber-400"/>
              )}
            </div>

            <div className="min-w-0">
              <div className="text-sm font-bold">
                {r.agent_name}
              </div>

              <div className="text-xs soft mt-1">
                {t.agentTrace.tool}: {r.tool_name||'-'}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
