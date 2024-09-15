/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',      // Specify the protocol (e.g., https)
        hostname: 'utfs.io',    // Specify the hostname (e.g., utfs.io)
        port: '',               // Optional: specify the port if any
        pathname: '/**',        // Specify the pattern for the path (/** allows all paths)
      },
    ],
  },
};

export default nextConfig;