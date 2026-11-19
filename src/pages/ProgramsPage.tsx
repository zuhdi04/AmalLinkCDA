import { Link } from 'react-router-dom';

export function ProgramsPage() {
  const samplePrograms = [
    {
      title: 'Digital Skills Training',
      summary: 'Hands-on workshops teaching modern technology, software literacy, and creative tools.',
    },
    {
      title: 'Youth Mentorship',
      summary: 'Connecting students with experienced professionals for guidance and career growth.',
    },
    {
      title: 'Community Outreach',
      summary: 'Local collaborative initiatives addressing specific community challenges and opportunities.',
    },
  ];

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-8" aria-label="Breadcrumb">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded-md py-1 px-2"
          >
            <span aria-hidden="true">&larr;</span> Back to Home
          </Link>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Our Programs
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Dedicated learning paths and collaborative opportunities designed to empower individuals.
          </p>
        </header>

        <section aria-label="Available programs" className="space-y-6">
          {samplePrograms.map((program) => (
            <article
              key={program.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-slate-300"
            >
              <h2 className="text-xl font-bold text-slate-900">{program.title}</h2>
              <p className="mt-2 text-slate-600">{program.summary}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
