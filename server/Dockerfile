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
ENV MONGODB_URL mongodb://mongodb:27017/dev

EXPOSE 8080

# run server
CMD [ "npm", "start" ]