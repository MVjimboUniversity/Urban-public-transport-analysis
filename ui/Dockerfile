FROM node:18

RUN mkdir /frontendtransit

WORKDIR /frontendtransit

COPY package.json /frontendtransit

COPY package-lock.json /frontendtransit

COPY ./public /frontendtransit/public

COPY ./src /frontendtransit/src
 
RUN npm install

COPY . /frontendtransit

EXPOSE 3000

CMD ["npm", "start"]
