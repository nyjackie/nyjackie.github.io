import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Jackie Xu',
  tagline: 'Software engineer in New York',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://nyjackie.github.io',
  baseUrl: '/',

  organizationName: 'nyjackie',
  projectName: 'blog',

  onBrokenLinks: 'throw',

  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Geist:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/docs',
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'devlog',
        routeBasePath: 'devlog',
        path: './devlog',
        blogTitle: 'Dev Log',
        blogDescription: 'Technical articles and development insights',
        showReadingTime: true,
        feedOptions: {
          type: ['rss', 'atom'],
          title: 'Jackie Xu - Dev Log',
        },
      },
    ],
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'lifelog',
        routeBasePath: 'lifelog',
        path: './lifelog',
        blogTitle: 'Life Log',
        blogDescription: 'Personal thoughts and life experiences',
        showReadingTime: true,
        feedOptions: {
          type: ['rss', 'atom'],
          title: 'Jackie Xu - Life Log',
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: false,
      disableSwitch: true,
    },
    navbar: {
      title: 'Jackie Xu',
      logo: {
        alt: 'Jackie Xu',
        src: 'https://github.com/nyjackie.png',
      },
      items: [
        { to: '/', label: 'Home', position: 'right', activeBaseRegex: '^/$' },
        { to: '/about', label: 'About', position: 'right' },
        { to: '/articles', label: 'Articles', position: 'right' },
        { to: '/projects/hantavirus-tracker', label: 'Projects', position: 'right' },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          items: [
            { label: 'github', href: 'https://github.com/nyjackie' },
            { label: 'linkedin', href: 'https://www.linkedin.com/in/jackieexu/' },
            { label: 'medium', href: 'https://medium.com/@jackiexu1228' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Jackie Xu · New York`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
