# Use a Node.js base image with common tools needed for Puppeteer/Chromium
# node:18-slim is a good balance between size and functionality.
FROM node:18-slim

# Install system dependencies for Chromium.
# These packages are crucial for Puppeteer to run headless Chrome successfully.
RUN apt-get update && apt-get install -y \
    chromium \
    fontconfig \
    locales \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    lsb-release \
    xdg-utils \
    wget \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache.
# This ensures npm install only runs if dependencies change.
COPY package.json package-lock.json ./

# Install production Node.js dependencies.
# --unsafe-perm=true and --allow-root are often necessary for native modules (like Puppeteer's) in Docker.
RUN npm install --production --unsafe-perm=true --allow-root

# Copy the rest of your application code
COPY . .

# Command to run your bot. This uses the "start" script defined in package.json.
CMD ["npm", "start"]