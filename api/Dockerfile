FROM node:alpine

WORKDIR /usr/app

COPY ./package.json ./
RUN npm install

# Make sure you delete node_modules on your host, before building the image
COPY ./ ./

CMD ["npm", "run", "start"]
