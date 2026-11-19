import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CtaCardList } from '../components/CtaCardList';
import { ctaItems } from '../data/ctaItems';
import type { Program } from '../types/program';
import { fetchActivePrograms, formatEventDate } from '../services/programService';

export function HomePage() {
  const [activePrograms, setActivePrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchActivePrograms();
      setActivePrograms(data.slice(0, 3));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Programs could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchActivePrograms()
      .then((data) => {
        if (isMounted) setActivePrograms(data.slice(0, 3));
      })
      .catch((err) => {
        if (isMounted) setError(err instanceof Error ? err.message : 'Programs could not be loaded. Please try again.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <>
      <section className="border-b border-beige-dark bg-cream">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-9 sm:px-8 sm:py-16 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <h1 className="max-w-3xl text-[clamp(2.25rem,7vw,4.5rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-burgundy-dark">
              Community starts with a place to participate.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              Find AmalLink CDA programs that are open for registration and choose the opportunity that fits you.
            </p>
            <Link to="/programs" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-burgundy px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-burgundy-dark active:bg-burgundy-dark">
              Browse open programs
            </Link>
          </div>
          <p className="max-w-md border-t-2 border-brand-green pt-5 text-base leading-7 text-muted lg:justify-self-end">
            Program details, dates, venues, and registration questions are brought together in one clear place.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <section aria-labelledby="active-programs-heading">
          <div className="mb-7 flex flex-col gap-4 border-b border-beige-dark pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="active-programs-heading" className="text-2xl font-bold tracking-tight text-burgundy-dark sm:text-3xl">Open programs</h2>
              <p className="mt-2 text-muted">Current opportunities accepting participant registrations.</p>
            </div>
            <Link to="/programs" className="inline-flex min-h-11 shrink-0 items-center rounded-lg text-sm font-semibold text-burgundy hover:underline">View all programs</Link>
          </div>

          {loading && (
            <div className="rounded-panel border border-beige-dark bg-cream px-6 py-12 text-center" role="status">
              <span className="mx-auto block h-7 w-7 animate-spin rounded-full border-[3px] border-burgundy border-r-transparent" aria-hidden="true" />
              <p className="mt-4 font-medium text-muted">Loading open programs...</p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-panel border border-burgundy/30 bg-burgundy-light p-6" role="alert">
              <h3 className="text-lg font-bold text-burgundy-dark">Programs could not be loaded</h3>
              <p className="mt-2 break-words text-sm text-burgundy-dark">{error}</p>
              <button type="button" onClick={loadPrograms} className="mt-5 min-h-11 rounded-lg bg-burgundy px-5 py-2 font-semibold text-white hover:bg-burgundy-dark">Try again</button>
            </div>
          )}

          {!loading && !error && activePrograms.length === 0 && (
            <div className="rounded-panel border border-beige-dark bg-cream px-6 py-12 text-center">
              <h3 className="text-xl font-bold text-burgundy-dark">No programs are open right now</h3>
              <p className="mx-auto mt-2 max-w-lg text-muted">Check the full programs page for the latest availability or refresh the list later.</p>
              <Link to="/programs" className="mt-6 inline-flex min-h-11 items-center rounded-lg border border-burgundy px-5 py-2 font-semibold text-burgundy hover:bg-burgundy-light">Check program availability</Link>
            </div>
          )}

          {!loading && !error && activePrograms.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {activePrograms.map((program) => {
                const date = formatEventDate(program.eventDate);
                return (
                  <article key={program.id} className="flex min-w-0 flex-col rounded-panel border border-beige-dark bg-cream p-6 transition-colors hover:border-burgundy/50">
                    <p className="text-sm font-semibold text-brand-green">Registration open</p>
                    <h3 className="mt-3 break-words text-xl font-bold text-burgundy-dark">{program.title}</h3>
                    <dl className="mt-5 space-y-2 text-sm text-muted">
                      {date && <div><dt className="inline font-semibold text-ink">Date: </dt><dd className="inline break-words">{date}</dd></div>}
                      {program.venueName && <div><dt className="inline font-semibold text-ink">Venue: </dt><dd className="inline break-words">{program.venueName}</dd></div>}
                    </dl>
                    <Link to="/programs" className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-burgundy px-4 py-2 text-sm font-semibold text-white hover:bg-burgundy-dark sm:mt-auto">
                      Register for this program
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section aria-labelledby="explore-heading" className="mt-16 sm:mt-20">
          <h2 id="explore-heading" className="text-2xl font-bold tracking-tight text-burgundy-dark">More from AmalLink</h2>
          <p className="mt-2 text-muted">Browse the complete program list or visit the news page.</p>
          <div className="mt-7"><CtaCardList items={ctaItems} /></div>
        </section>
      </div>
    </>
  );
}
