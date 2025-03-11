import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'YADRMS Documentation',
  tagline: "A project inspired by the people who said I couldn't.",
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://isaaclins.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/YADRMS/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Isaaclins', // Usually your GitHub org/user name.
  projectName: 'YADRMS', // Usually your repo name.

  onBrokenLinks: 'ignore',  // This will ignore broken links
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/isaaclins/YADRMS/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'YADRMS Documentation',
      logo: {
        alt: 'YADRMS Documentation Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/isaaclins/YADRMS',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs',
            },
          ],
        },
        {
          title: 'Authors',
          items: [
            {
              label: 'Isaac Lins',
              href: 'https://github.com/isaaclins',
            },
            {
              label: 'Another Author',
              href: 'https://exmaple1.com/',
            },
            {
              label: 'AnotherAnother Author',
              href: 'https://example2.com/',
            },          
            {
              label: 'AnotherAnotherAnother Author',
              href: 'https://example2.com/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Legal',
              to: '/legal',
            },
            {
              label: 'What is YADRMS?',
              href: '/help',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} YADRMS, Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
