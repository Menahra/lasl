# Stage 1: Build the application (install dependencies, compile TypeScript if applicable)
FROM node:22-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
# This layer only invalidates if package*.json changes
COPY package.json package-lock.json ./

# Install production and dev dependencies
# 'npm ci' for package-lock.json consistency, '--omit=dev' to exclude dev deps in final image
RUN npm ci

# Copy the rest of the application source code
# This layer invalidates if source code changes
COPY . .

# Stage 2: Create the final, smaller production image
# Use a slim Node.js runtime image for smaller size
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy only production dependencies from the builder stage
COPY --from=builder /app/node_modules ./node_modules

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
CMD ["npm", "start"]
