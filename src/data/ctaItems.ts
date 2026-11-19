import type { CtaCardItem } from '../types/cta';

export const ctaItems: CtaCardItem[] = [
  {
    id: 'programs',
    title: 'Programs',
    description: 'Review educational initiatives, skills development courses, and community sessions open for participation.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Mentors and learners engaged in an interactive workshop',
    actionText: 'View open programs',
    route: '/programs',
  },
  {
    id: 'news',
    title: 'News',
    description: 'Visit the news page for community announcements and updates from AmalLink CDA.',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Newspaper and modern communication media',
    actionText: 'Visit community news',
    route: '/news',
  },
];
