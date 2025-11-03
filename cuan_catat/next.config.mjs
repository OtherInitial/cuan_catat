import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,      
    // swcMinify: true,           
    // compiler: {
    //     removeConsole: process.env.NODE_ENV !== "development" 
    // }
}

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true, 
});

export default pwaConfig(nextConfig);
