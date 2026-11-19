import { Link } from 'react-router-dom';
import type { CtaCardItem } from '../types/cta';

interface CtaCardProps {
  item: CtaCardItem;
}

export function CtaCard({ item }: CtaCardProps) {
  return (
    <article className="h-full overflow-hidden rounded-panel border border-beige-dark bg-cream">
      <Link to={item.route} className="group flex h-full flex-col" aria-label={`${item.title}: ${item.actionText}`}>
        <div className="relative aspect-[16/9] overflow-hidden bg-beige">
          <img src={item.imageUrl} alt={item.imageAlt} width="1000" height="563" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-2xl font-bold tracking-tight text-burgundy-dark">{item.title}</h3>
          <p className="mt-2 leading-6 text-muted">{item.description}</p>
          <span className="mt-5 inline-flex min-h-11 items-center font-semibold text-burgundy group-hover:underline">{item.actionText}</span>
        </div>
      </Link>
    </article>
  );
}
