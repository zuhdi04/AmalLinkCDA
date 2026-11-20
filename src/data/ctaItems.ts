import type { CtaCardItem } from '../types/cta';

export const ctaItems: CtaCardItem[] = [
  {
    id: 'programs',
    title: 'Programs',
    description: 'Browse the programs that are open for registration and sign up for the one that fits you.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Mentors and learners engaged in an interactive workshop',
    actionText: 'View open programs',
    route: '/programs',
  },
  {
    id: 'news',
    title: 'News',
    description: 'Read community announcements and updates from AmalLink.',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Newspaper and modern communication media',
    actionText: 'Visit community news',
    route: '/news',
  },
];
