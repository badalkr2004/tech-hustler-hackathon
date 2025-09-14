# Using an official lightweight Node.js image.
FROM node:18-alpine

# Setting the working directory in the container.
WORKDIR /usr/src/app

# Copying package.json and package-lock.json (if available)
COPY package*.json ./

# Installing dependencies.
RUN npm install

# Copying the rest of the source code.
COPY . .

# Building the project (assuming tsc is configured to output to the 'dist' folder)
RUN npm run build

# Exposing the port (make sure this matches your config; here we assume 3000)
EXPOSE 3000

# Starting the application.
CMD ["npm", "start"]