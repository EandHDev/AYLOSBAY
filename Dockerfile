# Use a Node.js base image (choose a specific version if needed)
FROM node:20-alpine3.17

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if you have it)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your backend code
COPY . .

# Expose the port your backend server listens on
EXPOSE 5001

# Define the command to start your backend server
CMD ["npm", "start"]
