// next.config.js
/** @type {import('next').NextConfig} */

const DEFAULT_ENV = 'dev'

const env = {
    dev: {
      NEXT_PUBLIC_API_HOST: 'https://puppy.linemate.kr',
    },
    stage: {
      NEXT_PUBLIC_API_HOST: 'https://puppy.linemate.kr',
    },
    live: {
      NEXT_PUBLIC_API_HOST: 'https://puppy.linemate.kr',
    },
}

const nextConfig = {
    swcMinify: true,
    compiler: {
        styledComponents: true,
    },
    env: {
        ...{ ...env[(process.env.NEXT_PUBLIC_CONFIG) || DEFAULT_ENV] },
        ...{ ...env.common },
    },
};

export default nextConfig;