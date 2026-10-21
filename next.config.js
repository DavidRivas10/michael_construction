/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Nadie puede incrustar el sitio en un iframe (evita clickjacking).
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
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
