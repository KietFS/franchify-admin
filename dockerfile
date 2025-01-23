# Step 1: Use Node.js for building the app
FROM node:21 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the app's source code
COPY . .

# Build the app
RUN npm run build

# Step 2: Use a lightweight web server to serve the app
FROM nginx:1.21

# Copy the build output to NGINX's default public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port NGINX will serve on
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]