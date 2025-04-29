# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files

COPY . .

# Expose the port Next.js runs on

EXPOSE 3000


# Set environment variables for New Relic
ENV NODE_OPTIONS="--require newrelic"

# Start the Next.js application
CMD ["npm", "run", "dev"]
