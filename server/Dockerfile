# build server

FROM node:20

# set working directory within docker
WORKDIR /app

# copy server contents into container & build
COPY package*.json ./
RUN npm install
COPY . .

# set environment variables
ENV PORT 8080
ENV SOCKET_PORT 6060
ENV MONGODB_URL mongodb://mongodb:27017/dev

EXPOSE 8080
EXPOSE 6060

# run server
CMD [ "npm", "start" ]