import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Map,
  BrainCircuit,
  Radio,
  History,
  Users,
  ShieldCheck,
  Waves,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">

      <section className="relative overflow-hidden min-h-[680px] flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(19,164,164,.24),transparent_35%),radial-gradient(circle_at_30%_80%,rgba(0,102,140,.18),transparent_40%)]" />

        <img
          src={
            import.meta.env.VITE_HERO_IMAGE_URL ||
            "https://upload.wikimedia.org/wikipedia/commons/0/02/Underwater_photo_of_coral_reef.jpg"
          }
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          alt="Public-domain coral reef"
        />

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-24 w-full grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ocean-500/10 border border-ocean-500/20 text-ocean-600 dark:text-ocean-100 text-xs font-bold mb-6">
              <Waves size={14} />
              Tanmiyathon 2026 · Marine Monitoring
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-[-.04em] leading-[.95]">
              Community intelligence for{' '}
              <span className="text-ocean-500">healthier seas.</span>
            </h1>

            <p className="mt-7 text-lg md:text-xl soft max-w-xl leading-relaxed">
              MarineGuard AI turns community observations, marine imagery,
              sensor-ready data, and geospatial history into evidence-based
              priorities for monitoring and field verification.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link className="btn btn-primary" to="/submit">
                Analyze a marine site <ArrowRight size={17} />
              </Link>

              <Link className="btn btn-ghost" to="/map">
                <Map size={17} />
                Explore GIS map
              </Link>
            </div>

            <div className="mt-8 text-xs soft max-w-xl">
              Visual AI is an evidence signal, not a diagnosis. Priority is an
              internal operational index. Official decisions require appropriate
              approved data and verification.
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-[32px] overflow-hidden border border-[var(--border)] bg-[var(--bg-panel)] transition-colors duration-300">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(54,215,210,.3),transparent_35%)]" />

              <div className="absolute inset-x-8 top-10 bottom-8 rounded-[26px] border border-[var(--border)] bg-[var(--bg-glass)] backdrop-blur-md overflow-hidden">
                <div className="absolute -right-10 top-12 h-52 w-52 rounded-full border border-ocean-500/20" />
                <div className="absolute -left-16 bottom-10 h-64 w-64 rounded-full border border-ocean-500/10" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-24 w-24 rounded-[28px] bg-ocean-500/15 border border-ocean-500/30 flex items-center justify-center mx-auto mb-5">
                      <Waves size={44} className="text-ocean-500" />
                    </div>

                    <div className="text-2xl font-black">
                      Observe → Verify
                    </div>

                    <div className="soft mt-2">
                      People + AI + Sensors + History + GIS
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            [BrainCircuit, 'AI Analysis', 'Structured visual indicators, confidence, and limitations.'],
            [Radio, 'Sensor Intelligence', 'Simulator-ready marine measurements with transparent source labels.'],
            [History, 'Environmental Trends', 'Site history, repeated observations, and temporal context.'],
            [Map, 'GIS Prioritization', 'Interactive map that shows where attention is needed.'],
            [Users, 'Community Science', 'Turn scattered observations into a shared evidence layer.'],
            [ShieldCheck, 'Human Verification', 'Needs Review → Under Review → Verified.'],
          ].map(([Icon, t, d]) => (
            <div key={t} className="panel p-6">
              <div className="h-10 w-10 rounded-xl bg-ocean-500/10 text-ocean-500 flex items-center justify-center">
                <Icon size={19} />
              </div>

              <h3 className="font-bold mt-5">{t}</h3>
              <p className="text-sm soft mt-2 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
