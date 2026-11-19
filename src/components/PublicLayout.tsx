import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AppStatus } from './AppStatus';

const navigation = [
  { label: 'Home', to: '/', icon: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" /> },
  { label: 'Programs', to: '/programs', icon: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18M8 14h2M14 14h2M8 18h2" /></> },
  { label: 'News', to: '/news', icon: <><path d="M4 4h13v16H5a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1Z" /><path d="M17 8h3v10a2 2 0 0 1-2 2M7 8h6M7 12h6M7 16h4" /></> },
];

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main-content" className="fixed left-4 top-3 z-[60] -translate-y-24 rounded-lg bg-burgundy px-4 py-3 font-semibold text-white transition-transform focus:translate-y-0">Skip to main content</a>
      <header className="sticky top-0 z-30 border-b border-beige-dark bg-cream">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-8 lg:min-h-20">
          <Link to="/" className="flex min-h-11 shrink-0 items-center gap-2.5 rounded-md" aria-label="AmalLink CDA home">
            <img src="/icons/amallink-logo.svg" alt="" width="40" height="40" className="h-10 w-10" />
            <span className="text-lg font-extrabold tracking-tight sm:text-xl"><span className="text-burgundy">Amal</span><span className="text-brand-green">Link</span><span className="ml-2 text-xs font-semibold text-muted">CDA</span></span>
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `flex min-h-11 items-center rounded-lg border-b-2 px-4 py-2 text-sm font-semibold transition-colors hover:bg-burgundy-light active:bg-beige ${isActive ? 'border-burgundy text-burgundy' : 'border-transparent text-muted hover:text-burgundy'}`}>{item.label}</NavLink>
            ))}
          </nav>
        </div>
        <AppStatus />
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>

      <footer className="border-t border-beige-dark bg-cream">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-3"><img src="/icons/amallink-logo.svg" alt="" width="36" height="36" className="h-9 w-9" /><div><p className="font-bold"><span className="text-burgundy">Amal</span><span className="text-brand-green">Link</span> CDA</p><p className="mt-1 text-sm text-muted">Community programs and participation.</p></div></div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-4">{navigation.map((item) => <Link key={item.to} to={item.to} className="inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-burgundy hover:underline active:bg-burgundy-light">{item.label}</Link>)}</nav>
        </div>
      </footer>

      <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-beige-dark bg-cream pb-[env(safe-area-inset-bottom)] md:hidden">
        {navigation.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `flex min-h-[4.5rem] flex-col items-center justify-center gap-1 border-t-2 px-1 py-2 text-xs font-semibold transition-colors active:bg-beige ${isActive ? 'border-burgundy bg-burgundy-light text-burgundy' : 'border-transparent text-muted hover:bg-beige hover:text-burgundy'}`}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>{item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
