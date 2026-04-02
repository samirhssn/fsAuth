FROM node:20-alpine

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Run with tsx (TypeScript directly)
CMD ["npx", "tsx", "src/index.ts"]
