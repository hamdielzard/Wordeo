# build client

FROM node:20

# set working directory within docker
WORKDIR /app

# copy client contents into container & build
COPY package*.json ./
RUN npm install
COPY . .

# set environment variables
ENV PORT 3000

EXPOSE 3000

# run client
CMD [ "npm", "start" ]