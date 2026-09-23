import type { LinksFunction } from "react-router";

const rootLinks: LinksFunction = () => [
  {
    rel: "icon",
    type: "image/svg+xml",
    href: "/small-logo-icon.svg",
  },
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "use-credentials",
  },
  {
    href: "https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap",
    rel: "stylesheet",
  },
];

export { rootLinks };
