// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    compiler: {
        styledComponents: true,
    },
    env: {
        NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST,
    }
};

module.exports = nextConfig;
