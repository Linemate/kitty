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
    // src/app 구조를 쓰는 프로젝트는 Next.js 14 이상에서 이 설정이 없으면 무조건 빌드 실패
    experimental: {
      appDir: true,           // 이거 없으면 src/app 인식 못 함
    },
};

export default nextConfig;