import type { CtaCardItem } from '../types/cta';

export const ctaItems: CtaCardItem[] = [
  {
    id: 'programs',
    title: 'Programs',
    description: 'Discover educational initiatives, skills development courses, and community empowerment sessions.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Mentors and learners engaged in an interactive workshop',
    actionText: 'Explore Programs',
    route: '/programs',
  },
  {
    id: 'news',
    title: 'News',
    description: 'Read recent updates, community announcements, and stories highlighting our latest progress.',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Newspaper and modern communication media',
    actionText: 'Read Latest News',
    route: '/news',
  },
];
