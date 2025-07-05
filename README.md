This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Docker Deployment

### Quick Start

To run the application using Docker:

```bash
# Build and run
docker-compose up --build

# Or run in background
docker-compose up --build -d

# Stop the container
docker-compose down
```

### Manual Docker Commands

```bash
# Build the image
docker build -t job-aggregator-frontend .

# Run the container
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://your-backend-url job-aggregator-frontend

# Run in background
docker run -d -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://your-backend-url job-aggregator-frontend
```

### Environment Variables

Set the following environment variables:

- `NEXT_PUBLIC_API_URL`: URL of your backend API (default: http://192.168.1.247:8000)

Example:
```bash
export NEXT_PUBLIC_API_URL=http://your-backend-api.com
docker-compose up --build
```

### Useful Commands

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f

# Restart container
docker-compose restart

# Check resource usage
docker stats
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
