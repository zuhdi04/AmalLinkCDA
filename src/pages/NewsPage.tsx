import { Link } from 'react-router-dom';

export function NewsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="max-w-3xl border-b border-beige-dark pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-burgundy-dark sm:text-5xl">Community news</h1>
        <p className="mt-4 text-lg leading-8 text-muted">Updates and announcements from AmalLink community initiatives.</p>
      </header>
      <section aria-label="News updates" className="mt-8 rounded-panel border border-beige-dark bg-cream px-6 py-14 text-center sm:px-10">
        <h2 className="text-xl font-bold text-burgundy-dark">No news updates are currently published</h2>
        <p className="mx-auto mt-3 max-w-lg leading-7 text-muted">There are no announcements to show right now. In the meantime, you can browse programs that are open for registration.</p>
        <Link to="/programs" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-burgundy px-5 py-2 font-semibold text-white hover:bg-burgundy-dark">Browse programs</Link>
      </section>
    </div>
  );
}
