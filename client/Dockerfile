FROM node:alpine

RUN npm install -g pm2

WORKDIR /usr/app

COPY ./package.json ./
RUN npm install

# Make sure you delete node_modules on your host, before building the image
COPY ./ ./

# need the build the front end folder
RUN npm run build

CMD ["npm", "run", "start:docker"]
