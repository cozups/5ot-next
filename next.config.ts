import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jigzupuvmomlvtywqjdz.supabase.co/**",
      },
    ],
  },
};

export default nextConfig;
