#  Dockerfile for Node Express Backend


FROM node:latest

# Create App Directory

WORKDIR /app

# Install Dependencies

COPY package*.json ./

RUN npm install --silent

# Copy app source code
COPY . .

# Exports
EXPOSE 4000

CMD ["npm","start"]

