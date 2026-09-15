import React,{useEffect,useState}from'react';
import{getReports,imageUrl}from'../services/api';
import{Link}from'react-router-dom';
import PriorityBadge from'../components/PriorityBadge';
import Topbar from'../components/Topbar';

export default function Reports(){
  const[r,setR]=useState([]);

  useEffect(()=>{
    getReports().then(setR)
  },[]);

  return(
    <>
      <Topbar
        title="Community observations"
        subtitle="Every card is backed by a database record — not frontend mock data."
      />

      <div className="p-5 md:p-8 max-w-[1400px] mx-auto">

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

          {r.map(x=>
            <Link
              to={`/reports/${x.id}`}
              key={x.id}
              className="panel overflow-hidden hover:border-ocean-500/30 transition-colors"
            >

              <div className="aspect-[16/9] bg-[var(--bg-primary)]">
                {x.image?
                  <img
                    src={imageUrl(x.image.url)}
                    className="w-full h-full object-cover"
                    alt={x.site_name||'Marine observation'}
                  />
                  :
                  <div className="h-full flex items-center justify-center text-xs soft">
                    No image attached
                  </div>
                }
              </div>

              <div className="p-5">

                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold truncate">
                    {x.site_name}
                  </h3>

                  <PriorityBadge level={x.priority?.level}/>
                </div>

                <p className="text-sm soft mt-3 line-clamp-3">
                  {x.description||'No description provided.'}
                </p>

                <div className="flex justify-between mt-5 text-xs soft">
                  <span>
                    {new Date(x.created_at).toLocaleString()}
                  </span>

                  <span>
                    {x.status}
                  </span>
                </div>

              </div>
            </Link>
          )}

        </div>

        {!r.length&&
          <div className="panel p-12 text-center soft">
            No observations yet. Submit the first community observation.
          </div>
        }

      </div>
    </>
  );
}
