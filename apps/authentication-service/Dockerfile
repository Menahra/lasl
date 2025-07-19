# Stage 1: Build the application (install dependencies, compile TypeScript if applicable)
FROM node:22-alpine AS builder
ARG SERVICE_NAME=authentication-service

# Set working directory inside the container
WORKDIR /app

# Install pnpm globally in the builder stage
RUN npm install -g pnpm

# Set a temporary working directory within the builder for all monorepo operations
WORKDIR /tmp/monorepo

# Copy necessary pnpm config files from the monorepo root
# These paths are relative to the Docker build context (which is your monorepo root)
COPY pnpm-lock.yaml ./pnpm-lock.yaml
COPY pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY package.json ./package.json

# Copy the specific service's package.json and tsconfig.json
COPY apps/${SERVICE_NAME}/package.json ./services/${SERVICE_NAME}/package.json
COPY apps/${SERVICE_NAME}/tsconfig.json ./services/${SERVICE_NAME}/tsconfig.json

# Install all workspace dependencies. This populates the pnpm store and links
# everything based on the root lockfile.
RUN pnpm install --frozen-lockfile

# Copy the rest of the specific service's source code
# This layer invalidates if source code changes within the service
COPY apps/${SERVICE_NAME}/src ./services/${SERVICE_NAME}/src

# Prepare production dependencies specifically for this service using pnpm deploy
# This creates a lean, self-contained node_modules for the final image.
RUN pnpm deploy --prod --filter=${SERVICE_NAME} /tmp/monorepo/services/${SERVICE_NAME}/prod_node_modules

# Stage 2: Create the final, smaller production image
# Use a slim Node.js runtime image for smaller size
FROM node:22-alpine
ARG SERVICE_NAME=authentication-service

# Set working directory
WORKDIR /app

# Install pnpm globally in the final stage if your CMD uses 'pnpm' directly
RUN npm install -g pnpm

# Copy only the prepared production dependencies from the builder stage for THIS service
COPY --from=builder /tmp/monorepo/services/${SERVICE_NAME}/prod_node_modules ./node_modules

# Copy the specific service's package.json to the final image
# This is usually needed if your `CMD` or application relies on reading `package.json` at runtime.
COPY --from=builder /tmp/monorepo/services/${SERVICE_NAME}/package.json ./package.json

# Copy the built application code (or raw source if no build step)
# If you had a 'build' step in Stage 1, you'd copy the build output here:
# COPY --from=builder /app/dist ./dist # Example for TypeScript 'dist' folder
COPY --from=builder /app .

# Expose the port your authentication service listens on
EXPOSE 3000

# Define environment variables for the container (can be overridden by Docker Compose)
ENV NODE_ENV=production
# Placeholder for your database connection string, etc.
# These will typically be overridden by docker-compose.yml or Kubernetes
ENV MONGO_URI=mongodb://your_user:your_password@mongodb:27017/your_auth_db?authSource=admin
ENV JWT_SECRET=some_strong_jwt_secret_key

# Command to run your application when the container starts
CMD ["pnpm", "start"]
