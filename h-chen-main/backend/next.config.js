//  @type {import('next').NextConfig}
const nextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "*" }] },
  // redirects: async () => {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/en/auth/login",
  //       permanent: true,
  //     },
  //   ];
  // },
  typescript: {
    ignoreBuildErrors: true,
  }
};

module.exports = nextConfig;
