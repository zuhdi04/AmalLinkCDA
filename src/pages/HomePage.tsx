import { CtaCardList } from '../components/CtaCardList';
import { ctaItems } from '../data/ctaItems';

export function HomePage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
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

        <section aria-label="Featured sections">
          <CtaCardList items={ctaItems} />
        </section>
      </div>
    </main>
  );
}
