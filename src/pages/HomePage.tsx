import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CtaCardList } from '../components/CtaCardList';
import { ctaItems } from '../data/ctaItems';
import type { Program } from '../types/program';
import { fetchActivePrograms, formatEventDate } from '../services/programService';

export function HomePage() {
  const [activePrograms, setActivePrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchActivePrograms()
      .then((data) => {
        if (isMounted) setActivePrograms(data.slice(0, 3));
      })
      .catch(() => {
        // Non-blocking for homepage
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-2">
            AmalLink CDA
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Empowering Communities
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-600">
            Explore our dedicated programs and stay up to date with the latest news.
          </p>
        </header>

        {/* Active Programs Highlight */}
        {!loading && activePrograms.length > 0 && (
          <section aria-labelledby="active-programs-heading" className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 id="active-programs-heading" className="text-2xl font-bold text-slate-900">
                  Open Programs
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Active programs currently accepting participant registrations.
                </p>
              </div>
              <Link
                to="/programs"
                className="text-sm font-medium text-blue-700 hover:text-blue-900 py-2 px-3 rounded-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activePrograms.map((p) => {
                const date = formatEventDate(p.eventDate);
                return (
                  <article
                    key={p.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition"
                  >
                    <div className="space-y-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Open
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
                      {date && (
                        <p className="text-xs text-slate-500">
                          <span className="font-semibold text-slate-600">Date:</span> {date}
                        </p>
                      )}
                      {p.venueName && (
                        <p className="text-xs text-slate-500">
                          <span className="font-semibold text-slate-600">Venue:</span> {p.venueName}
                        </p>
                      )}
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-100">
                      <Link
                        to="/programs"
                        className="inline-flex items-center justify-center w-full px-4 py-2 min-h-[44px] rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        Register
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <section aria-label="Featured sections">
          <CtaCardList items={ctaItems} />
        </section>
      </div>
    </main>
  );
}
