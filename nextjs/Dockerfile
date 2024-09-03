FROM node:21-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
COPY . .
# Load the environment variables from the mounted .env file
CMD ["sh", "-c", "npm run start"]
