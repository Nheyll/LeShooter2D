# Start with the official Node.js 14 image
FROM node:14 AS build

# Create a directory for our app and set it as the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Build the application using webpack
RUN npm run build

# Start with the official Nginx image
FROM nginx:latest

# Copy the built files from the previous stage to the Nginx container
COPY --from=build /app/dist /usr/share/nginx/html
COPY  src/style.css /usr/share/nginx/html
COPY  src/index.html /usr/share/nginx/html

# Copy the Nginx configuration file to the container
COPY nginx.conf /etc/nginx/nginx.conf
COPY myapp.conf /etc/nginx/conf.d/

# Expose port 80 for incoming traffic
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
