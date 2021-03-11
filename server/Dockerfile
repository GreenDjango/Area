# Server

# set builder image
FROM node:14.15-alpine AS builder

# set the working directory in the container
WORKDIR /build

# copy the dependencies file to the working directory
COPY package*.json ./

# install dependencies
RUN npm install --silent --no-fund

# copy the src
COPY ./ ./

# compiles and minifies for production
RUN npm run build

# set base image (host OS)
FROM node:14.15-alpine

# set the working directory in the container
WORKDIR /code

# copy the dependencies file to the working directory
COPY package*.json ./

# install dependencies
RUN npm install --only=prod --silent --no-fund

# expose container port
EXPOSE 9000

# set environment var 
ENV NODE_ENV=production
ENV SERVER_PORT=9000
ENV JWT_SECRET=jwt_secret
ENV MONGO_CONNECTION=mongodb://localhost:27017/test

# copy the content of the local directory to the working directory
COPY --from=builder /build/dist/ ./dist/

# command to run on container start
CMD [ "node", "dist/server" ]
