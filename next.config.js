// next.config.js
require('dotenv').config({ path: '.env' });

/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    compiler: {
        styledComponents: true,
    },
    env: {
        NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST,
        NEXT_PUBLIC_NAVER_ID: process.env.NEXT_PUBLIC_NAVER_ID,
    }
};

module.exports = nextConfig;