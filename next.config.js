/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return [
      { source: "/servicios", destination: "/services", permanent: true },
      { source: "/portafolio", destination: "/portfolio", permanent: true },
      { source: "/resenas", destination: "/reviews", permanent: true },
      { source: "/contacto", destination: "/contact", permanent: true },
      { source: "/estimado", destination: "/estimate", permanent: true },
    ];
  },
};

module.exports = nextConfig;
