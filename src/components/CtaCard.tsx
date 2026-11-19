import { Link } from 'react-router-dom';
import type { CtaCardItem } from '../types/cta';

interface CtaCardProps {
  item: CtaCardItem;
}

export function CtaCard({ item }: CtaCardProps) {
  return (
    <article className="h-full">
      <Link
        to={item.route}
        className="group relative flex h-full min-h-[340px] sm:min-h-[400px] flex-col justify-end overflow-hidden rounded-2xl p-7 text-left shadow-sm transition duration-300 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 cursor-pointer border border-slate-200"
        aria-label={`${item.title}: ${item.actionText}`}
      >
        <img
          src={item.imageUrl}
          alt={item.imageAlt}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Dark gradient overlay guaranteeing WCAG AA text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 transition-opacity duration-300 group-hover:from-black/95" />

        <div className="relative z-10 flex flex-col gap-2">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {item.title}
          </h2>
          <p className="line-clamp-2 text-sm text-slate-200">
            {item.description}
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white group-hover:underline">
            <span>{item.actionText}</span>
            <span aria-hidden="true">&rarr;</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
