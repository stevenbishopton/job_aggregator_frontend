/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images:{
        remotePatterns:[{
            hostname:"upload.wikimedia.org"
        }
        ]
    }
};

export default nextConfig;
