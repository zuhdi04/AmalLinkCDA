import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          AmalLink CDA
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          React + Vite + Tailwind CSS Starter Project
        </p>
      </header>

      <section className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => setCount((prev) => prev + 1)}
          className="inline-flex min-h-[44px] min-w-[120px] items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-base font-medium text-slate-800 shadow-xs transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Count: {count}
        </button>
      </section>
    </main>
  );
}
