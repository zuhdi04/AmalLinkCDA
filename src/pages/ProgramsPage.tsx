import { useState, useEffect } from 'react';
import type { Program } from '../types/program';
import { fetchActivePrograms, formatBudget, formatEventDate } from '../services/programService';
import { RegistrationModal } from '../components/RegistrationModal';

export function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  function loadPrograms() {
    setLoading(true);
    setError(null);
    fetchActivePrograms()
      .then(setPrograms)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load programs. Please check your network and try again.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadPrograms(); }, []);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="max-w-3xl border-b border-beige-dark pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-burgundy-dark sm:text-5xl">Programs open for participation</h1>
        <p className="mt-4 text-lg leading-8 text-muted">Review community initiatives, workshops, and opportunities, then register for the program that interests you.</p>
      </header>

      <div className="mt-8">
        {loading && (
          <div aria-live="polite" className="rounded-panel border border-beige-dark bg-cream px-6 py-14 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-[3px] border-burgundy border-r-transparent" role="status"><span className="sr-only">Loading programs...</span></div>
            <p className="mt-4 font-medium text-muted">Retrieving open programs...</p>
          </div>
        )}

        {!loading && error && (
          <div role="alert" className="rounded-panel border border-burgundy/30 bg-burgundy-light p-6 sm:p-8">
            <h2 className="text-xl font-bold text-burgundy-dark">Unable to display programs</h2>
            <p className="mt-2 break-words text-burgundy-dark">{error}</p>
            <button type="button" onClick={loadPrograms} className="mt-5 min-h-11 rounded-lg bg-burgundy px-5 py-2 font-semibold text-white hover:bg-burgundy-dark">Retry loading</button>
          </div>
        )}

        {!loading && !error && programs.length === 0 && (
          <div className="rounded-panel border border-beige-dark bg-cream px-6 py-14 text-center">
            <h2 className="text-xl font-bold text-burgundy-dark">No active programs right now</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted">There are currently no programs open for registration. New opportunities will appear here when they become available.</p>
            <button type="button" onClick={loadPrograms} className="mt-6 min-h-11 rounded-lg border border-burgundy px-5 py-2 font-semibold text-burgundy hover:bg-burgundy-light">Refresh list</button>
          </div>
        )}

        {!loading && !error && programs.length > 0 && (
          <section aria-label="Available programs" className="space-y-5">
            {programs.map((program) => {
              const formattedDate = formatEventDate(program.eventDate);
              const formattedBudget = formatBudget(program.targetBudget);
              return (
                <article key={program.id} className="min-w-0 overflow-hidden rounded-panel border border-beige-dark bg-cream p-6 transition-colors hover:border-burgundy/50 sm:p-7">
                  {program.imageDataUrl && (
                    <div className="-mx-6 -mt-6 mb-6 aspect-[16/9] overflow-hidden bg-beige sm:-mx-7 sm:-mt-7">
                      <img src={program.imageDataUrl} alt={program.title} width="1000" height="563" loading="lazy" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-brand-green">Registration open</p>
                      <h2 className="mt-2 break-words text-2xl font-bold tracking-tight text-burgundy-dark">{program.title}</h2>
                      <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-muted sm:grid-cols-2">
                        {formattedDate && <div><dt className="font-semibold text-ink">Date</dt><dd className="mt-1 break-words">{formattedDate}</dd></div>}
                        {program.venueName && <div><dt className="font-semibold text-ink">Venue</dt><dd className="mt-1 break-words">{program.venueName}{program.venueAddress ? `, ${program.venueAddress}` : ''}</dd></div>}
                        {formattedBudget && <div><dt className="font-semibold text-ink">Target budget</dt><dd className="mt-1 break-words">{formattedBudget}</dd></div>}
                      </dl>
                      {program.notes && <div className="mt-5 border-t border-beige-dark pt-4"><h3 className="text-sm font-semibold text-ink">Program notes</h3><p className="mt-1 whitespace-pre-line break-words text-sm leading-6 text-muted">{program.notes}</p></div>}
                    </div>
                    <button type="button" onClick={() => setSelectedProgram(program)} className="min-h-11 shrink-0 rounded-lg bg-burgundy px-5 py-2.5 font-semibold text-white transition-colors hover:bg-burgundy-dark active:bg-burgundy-dark sm:self-center">Register</button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      <RegistrationModal program={selectedProgram} isOpen={selectedProgram !== null} onClose={() => setSelectedProgram(null)} />
    </div>
  );
}
