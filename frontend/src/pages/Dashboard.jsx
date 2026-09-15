import React,{useEffect,useState}from'react';
import{BarChart3,MapPinned,ShieldCheck,AlertTriangle}from'lucide-react';
import{getDashboard,getTrends,getReports}from'../services/api';
import Topbar from'../components/Topbar';
import StatCard from'../components/StatCard';
import PriorityBadge from'../components/PriorityBadge';
import{LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer,BarChart,Bar}from'recharts';
import{Link}from'react-router-dom';

export default function Dashboard(){
  const[d,setD]=useState(null),
  [tr,setTr]=useState([]),
  [reports,setReports]=useState([]);

  useEffect(()=>{
    Promise.all([
      getDashboard(),
      getTrends(),
      getReports()
    ]).then(([a,b,c])=>{
      setD(a);
      setTr(b);
      setReports(c);
    })
  },[]);

  return(
    <>
      <Topbar
        title="Marine intelligence dashboard"
        subtitle="A live view of observations, evidence, priorities, and verification."
      />

      <div className="p-5 md:p-8 max-w-[1500px] mx-auto space-y-6">

        {d&&
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label="Total reports"
              value={d.total_reports}
              icon={BarChart3}
            />

            <StatCard
              label="Active areas"
              value={d.active_areas}
              icon={MapPinned}
            />

            <StatCard
              label="High priority"
              value={d.high_priority}
              icon={AlertTriangle}
              accent="text-rose-300"
            />

            <StatCard
              label="Verified"
              value={d.verified_reports}
              icon={ShieldCheck}
              accent="text-emerald-300"
            />
          </div>
        }

        <div className="grid lg:grid-cols-3 gap-6">

          <div className="panel p-6 lg:col-span-2">

            <div className="flex justify-between">

              <div>
                <h2 className="font-bold">
                  Observation activity
                </h2>

                <p className="text-xs soft mt-1">
                  Records stored in the MarineGuard database.
                </p>
              </div>

            </div>

            <div className="h-72 mt-6">

              {tr.length?
                <ResponsiveContainer>
                  <LineChart data={tr}>

                    <XAxis
                      dataKey="date"
                      stroke="var(--text-muted)"
                      fontSize={11}
                    />

                    <YAxis
                      stroke="var(--text-muted)"
                      fontSize={11}
                    />

                    <Tooltip
                      contentStyle={{
                        background:'var(--bg-panel)',
                        color:'var(--text-primary)',
                        border:'1px solid var(--border-strong)',
                        borderRadius:12
                      }}
                      labelStyle={{
                        color:'var(--text-primary)'
                      }}
                      itemStyle={{
                        color:'var(--accent)'
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="reports"
                      stroke="#13a4a4"
                      strokeWidth={3}
                      dot={{r:3}}
                    />

                  </LineChart>
                </ResponsiveContainer>
                :
                <div className="h-full flex items-center justify-center soft text-sm">
                  No observation history yet.
                </div>
              }

            </div>
          </div>

          <div className="panel p-6">

            <h2 className="font-bold">
              Priority distribution
            </h2>

            <div className="h-72 mt-6">

              {d?
                <ResponsiveContainer>
                  <BarChart
                    data={Object.entries(
                      d.priority_distribution
                    ).map(([name,value])=>({name,value}))}
                  >

                    <XAxis
                      dataKey="name"
                      stroke="var(--text-muted)"
                      fontSize={10}
                    />

                    <YAxis
                      stroke="var(--text-muted)"
                      fontSize={11}
                    />

                    <Tooltip
                      contentStyle={{
                        background:'var(--bg-panel)',
                        color:'var(--text-primary)',
                        border:'1px solid var(--border-strong)',
                        borderRadius:12
                      }}
                      labelStyle={{
                        color:'var(--text-primary)'
                      }}
                      itemStyle={{
                        color:'var(--accent)'
                      }}
                    />

                    <Bar
                      dataKey="value"
                      fill="#13a4a4"
                      radius={[6,6,0,0]}
                    />

                  </BarChart>
                </ResponsiveContainer>
                :
                null
              }

            </div>
          </div>

        </div>

        <div className="panel overflow-hidden">

          <div className="p-6 flex justify-between items-center">

            <div>
              <h2 className="font-bold">
                Recent observations
              </h2>

              <p className="text-xs soft mt-1">
                Latest cases and their current decision state.
              </p>
            </div>

            <Link
              to="/reports"
              className="text-sm text-ocean-500 font-bold"
            >
              View all →
            </Link>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-black/[.025] dark:bg-white/[.025] text-xs soft">

                <tr>
                  <th className="text-left p-4">
                    Site
                  </th>

                  <th className="text-left p-4">
                    Observation
                  </th>

                  <th className="text-left p-4">
                    Priority
                  </th>

                  <th className="text-left p-4">
                    Status
                  </th>
                </tr>

              </thead>

              <tbody>

                {reports.slice(0,7).map(r=>
                  <tr
                    key={r.id}
                    className="border-t border-[var(--border)]"
                  >

                    <td className="p-4 font-semibold">
                      {r.site_name}
                    </td>

                    <td className="p-4 soft max-w-md">
                      {r.description}
                    </td>

                    <td className="p-4">
                      <PriorityBadge
                        level={r.priority?.level}
                      />
                    </td>

                    <td className="p-4 text-xs soft">
                      {r.status}
                    </td>

                  </tr>
                )}

              </tbody>

            </table>

            {!reports.length&&
              <div className="p-8 text-center soft text-sm">
                No observations yet. Submit the first community observation.
              </div>
            }

          </div>

        </div>

      </div>
    </>
  );
}
