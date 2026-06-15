import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  // Silence the Turbopack/webpack conflict — next-pwa uses webpack under the hood.
  // Setting an empty turbopack config tells Next.js we are intentionally using webpack.
  turbopack: {},
};

export default withPWA(nextConfig);
