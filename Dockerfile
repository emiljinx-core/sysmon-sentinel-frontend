# Dockerfile
# Multi-stage build for a Next.js project using the App Router + API routes

##########################
# 1. Builder Stage
##########################
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy package files and install deps
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts --prefer-offline

# Copy full project source
COPY . .

# Build Next.js for production
RUN npm run build


##########################
# 2. Runner Stage
##########################
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=3000

# Copy required files from builder
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/package-lock.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/app ./app
COPY --from=builder /usr/src/app/next.config.ts ./

# Copy lib/ only if it exists
RUN if [ -d /usr/src/app/lib ]; then cp -r /usr/src/app/lib ./lib; fi

EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]
