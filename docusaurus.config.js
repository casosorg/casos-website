const {themes} = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "CasOS",
  tagline: "A cloud operating system built on Kubernetes",
  url: "https://casosorg.github.io",
  baseUrl: "/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.png",
  organizationName: "casosorg",
  projectName: "casos-website",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh"],
  },
  themeConfig: {
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "CasOS",
      logo: {
        alt: "CasOS Logo",
        src: "img/logo.png",
      },
      items: [
        {
          type: "doc",
          docId: "overview",
          position: "left",
          label: "Docs",
        },
        {
          to: "/blog",
          label: "Blog",
          position: "left",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
        {
          href: "https://github.com/casosorg/casos",
          label: "GitHub",
          position: "right",
        },
        {
          href: "https://discord.gg/5rPsrAzK7S",
          label: "Discord",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Overview",
              to: "/docs/overview",
            },
            {
              label: "Get Started",
              to: "/docs/get-started",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/casosorg/casos",
            },
            {
              label: "Discord",
              href: "https://discord.gg/5rPsrAzK7S",
            },
            {
              label: "Issues",
              href: "https://github.com/casosorg/casos/issues",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "Live Demo",
              href: "https://casos.casnode.com",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} CasOS Authors. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ["bash", "json", "yaml", "go"],
    },
  },
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/casosorg/casos-website/edit/master/",
        },
        blog: {
          showReadingTime: true,
          editUrl: "https://github.com/casosorg/casos-website/edit/master/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
