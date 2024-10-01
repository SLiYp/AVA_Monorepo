FROM node:21-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

# Pass environment variable at build time
ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}

RUN npm run build
COPY . .
# Load the environment variables from the mounted .env file
CMD ["sh", "-c", "npm run start"]
