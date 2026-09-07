import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // URLs that exist on the current Lovable site and must not 404 after
      // cutover. /agents and /pricing survive as real routes in the new IA.
      { source: "/book-demo", destination: "/contact#demo", permanent: true },
    ];
  },
};

export default nextConfig;
