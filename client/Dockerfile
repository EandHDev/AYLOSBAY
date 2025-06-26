FROM node:20-alpine3.17 AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./  
RUN npm install

COPY . .
RUN npm run build

# Use a smaller Nginx image for serving the static files
FROM nginx:alpine

# Copy the build output to the Nginx webroot
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 (default for Nginx)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
