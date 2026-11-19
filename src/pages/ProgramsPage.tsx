import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      .then((data) => {
        setPrograms(data);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load programs from Firebase. Please check your network and try again.'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadPrograms();
  }, []);

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-8" aria-label="Breadcrumb">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded-md py-2 px-2 min-h-[44px]"
          >
            <span aria-hidden="true">&larr;</span> Back to Home
          </Link>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Our Programs
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Dedicated community initiatives, educational workshops, and collaborative opportunities open for participation.
          </p>
        </header>

        {/* Loading State */}
        {loading && (
          <div
            aria-live="polite"
            className="py-16 text-center rounded-xl border border-slate-200 bg-slate-50 p-8"
          >
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]" role="status">
              <span className="sr-only">Loading programs...</span>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-600">
              Retrieving active programs from Firebase...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-900"
          >
            <h2 className="text-lg font-bold text-red-800">Unable to display programs</h2>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <div className="mt-4">
              <button
                type="button"
                onClick={loadPrograms}
                className="inline-flex items-center px-4 py-2 min-h-[44px] rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
              >
                Retry loading
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && programs.length === 0 && (
          <div className="py-16 text-center rounded-xl border border-slate-200 bg-slate-50 p-8">
            <h2 className="text-xl font-bold text-slate-800">No Active Programs Right Now</h2>
            <p className="mt-2 text-slate-600 max-w-md mx-auto text-sm">
              There are currently no active programs open for registration. Once programs are activated in the management console, they will appear here.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={loadPrograms}
                className="inline-flex items-center px-4 py-2 min-h-[44px] rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                Refresh list
              </button>
            </div>
          </div>
        )}

        {/* Programs List */}
        {!loading && !error && programs.length > 0 && (
          <section aria-label="Available programs" className="space-y-6">
            {programs.map((program) => {
              const formattedDate = formatEventDate(program.eventDate);
              const formattedBudget = formatBudget(program.targetBudget);

              return (
                <article
                  key={program.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-slate-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                          Registration Open
                        </span>
                        {formattedBudget && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            Budget: {formattedBudget}
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {program.title}
                      </h2>

                      {/* Project Meta Information */}
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600 pt-1">
                        {formattedDate && (
                          <div>
                            <dt className="font-semibold text-slate-700 inline">Date: </dt>
                            <dd className="inline">{formattedDate}</dd>
                          </div>
                        )}
                        {program.venueName && (
                          <div>
                            <dt className="font-semibold text-slate-700 inline">Venue: </dt>
                            <dd className="inline">
                              {program.venueName}
                              {program.venueAddress ? ` (${program.venueAddress})` : ''}
                            </dd>
                          </div>
                        )}
                      </dl>

                      {program.notes && (
                        <p className="text-slate-600 text-sm whitespace-pre-line pt-1 border-t border-slate-100">
                          {program.notes}
                        </p>
                      )}
                    </div>

                    <div className="sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedProgram(program)}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 min-h-[44px] rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                      >
                        Register for Program
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      {/* Registration Modal Dialog */}
      <RegistrationModal
        program={selectedProgram}
        isOpen={selectedProgram !== null}
        onClose={() => setSelectedProgram(null)}
      />
    </main>
  );
}
