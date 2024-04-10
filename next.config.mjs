/** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/:path*', // Pistache APIへのプロキシ
            },
            {
                source: '/json-server-api/:path*',
                destination: 'https://localhost:3001/:path*', // json-server APIへのプロキシ
            }
        ];
    },
};

export default nextConfig;