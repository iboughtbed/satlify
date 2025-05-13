const links = {
  instagram: "https://github.com/iboughtbed",
  github: "https://github.com/iboughtbed",
};

export const siteConfig = {
  name: "Satlify",
  url: "https://satlify.vercel.app",
  ogImage: "https://satlify.vercel.app/og.png",
  description: "Prepare for SAT with AI",
  links,
  mainNav: [
    { key: "practice", href: "/" },
    { key: "resources", href: "/" },
  ],
  footerNav: [
    {
      title: "Help",
      items: [
        { title: "Contact", href: "#", external: false },
        { title: "Terms", href: "#", external: false },
        { title: "Privacy", href: "#", external: false },
      ],
    },
    {
      title: "Social",
      items: [
        {
          title: "Instagram",
          href: links.instagram,
          external: true,
        },
        {
          title: "TikTok",
          href: links.instagram,
          external: true,
        },
        {
          title: "GitHub",
          href: links.github,
          external: true,
        },
      ],
    },
    {
      title: "Resources",
      items: [{ title: "Feature requests", href: "#", external: false }],
    },
    {
      title: "Company",
      items: [
        { title: "About", href: "#", external: false },
        { title: "Blog", href: "#", external: false },
      ],
    },
  ],
};

export type SiteConfig = typeof siteConfig;
