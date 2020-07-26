# Tells the Docker which base image to start.
FROM node:12-alpine

# Adds files from the host file system into the Docker container.  
ADD . /app

# Sets the current working directory for subsequent instructions
WORKDIR /app

RUN npm install

#expose a port to allow external access
EXPOSE 2020

# Start main application
CMD ["npm", "start"]