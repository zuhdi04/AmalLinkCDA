import type { CtaCardItem } from '../types/cta';
import { CtaCard } from './CtaCard';

interface CtaCardListProps {
  items: CtaCardItem[];
}

export function CtaCardList({ items }: CtaCardListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {items.map((item) => (
        <CtaCard key={item.id} item={item} />
      ))}
    </div>
  );
}
