export default function sitemap() {
  const base = "https://www.michaelconstruction.com";
  const routes = ["", "/services", "/portfolio", "/estimate", "/reviews", "/contact"];
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
