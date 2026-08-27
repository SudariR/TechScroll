// Tier 2: resolve a company domain into a real logo URL.
// Today: Google favicon service (no API key, works instantly).
// Week 3: swap this ONE function to logo.dev with a backend-held token.
export const getBrandLogo = (domain?: string, size = 128): string | null => {
  if (!domain) return null;
  const clean = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  return `https://www.google.com/s2/favicons?domain=${clean}&sz=${size}`;
};