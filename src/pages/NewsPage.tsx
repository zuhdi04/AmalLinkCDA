import { Link } from 'react-router-dom';

export function NewsPage() {
  const sampleNews = [
    {
      id: 1,
      title: 'Spring 2026 Community Cohort Announced',
      date: 'November 2026',
      summary: 'Applications are now open for the upcoming cohort focusing on local technology education.',
    },
    {
      id: 2,
      title: 'Partnering for Expanded Educational Access',
      date: 'October 2026',
      summary: 'New resources and facilities will be available across neighborhood centers starting this winter.',
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
            Latest News
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Updates, stories, and milestones from our community initiatives.
          </p>
        </header>

        <section aria-label="News articles" className="space-y-6">
          {sampleNews.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-slate-300"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-900">{item.title}</h2>
                <time className="text-xs font-medium text-slate-500 whitespace-nowrap">{item.date}</time>
              </div>
              <p className="mt-2 text-slate-600">{item.summary}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
