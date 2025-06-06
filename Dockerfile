# Use official Nginx image
FROM nginx:alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy your static files into Nginx's web directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80
