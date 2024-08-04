FROM node:18-alpine
WORKDIR /client

COPY ./client/public/ /client/public
COPY ./client/src/ /client/src
COPY ./client/package.json /client/

RUN npm install

CMD ["npm", "start"]