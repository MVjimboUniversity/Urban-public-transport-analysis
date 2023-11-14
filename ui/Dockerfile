FROM node:18

RUN mkdir /frontendtransit

WORKDIR /frontendtransit

COPY package.json /frontendtransit

RUN npm install

COPY package-lock.json /frontendtransit

COPY ./public /frontendtransit/public

COPY ./src /frontendtransit/src

EXPOSE 3000

CMD ["npm", "start"]
