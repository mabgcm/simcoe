import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://simcoeturkish.ca";
  const routes = ["", "/about", "/news", "/events", "/newcomers-guide", "/membership", "/donate", "/contact", "/privacy", "/terms", "/gallery", "/sponsors", "/login", "/register", "/portal"];
  const localized = routes.flatMap((route) => [route, route === "" ? "/en" : `/en${route}`]);
  return localized.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8
  }));
}
