/** @type {import('next').NextConfig} */

// 개인정보를 받는 /request가 있어 기본 보안 응답 헤더를 둔다
const securityHeaders = [
  // 다른 사이트가 이 페이지를 iframe으로 감싸지 못하게(클릭재킹)
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // 글꼴은 버전 이름 폴더(public/fonts/pretendard-1.3.9)에 있어 내용이 바뀌지 않는다. 버전을 올리면 폴더 이름을 바꾼다
      { source: '/fonts/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ];
  },
};

module.exports = nextConfig;
