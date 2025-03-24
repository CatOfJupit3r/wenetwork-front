# client/Dockerfile
FROM node:18-alpine

ARG VITE_BACKEND_URL

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

EXPOSE 4173
# Use preview instead of build for production
CMD ["npm", "run", "preview"]
