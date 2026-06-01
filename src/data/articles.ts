export type ArticleCategory = 'devlog' | 'lifelog' | 'essay' | 'notes';

export type Article = {
  href: string;
  title: string;
  date: string;
  category: ArticleCategory;
};

export const ARTICLES: Article[] = [
  {
    href: '/devlog/robotics-telemetry-dashboard',
    title: 'Building a real-time robotics telemetry dashboard in the browser',
    date: 'Jun 1, 2026',
    category: 'devlog',
  },
  {
    href: '/devlog/building-multi-agent-ai-systems',
    title: 'How I Built a Multi-Agent AI System (And Why You Should Too)',
    date: 'Feb 1, 2026',
    category: 'devlog',
  },
  {
    href: '/devlog/waifu-believes-in-you-theory',
    title: 'Correlation between anime profile pictures and engineering skill',
    date: 'Feb 1, 2025',
    category: 'devlog',
  },
  {
    href: '/lifelog/welcome-to-lifelog',
    title: 'Welcome to Life Log',
    date: 'Feb 1, 2025',
    category: 'lifelog',
  },
];
