/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "t3tgtmkcuvk652qr.public.blob.vercel-storage.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
