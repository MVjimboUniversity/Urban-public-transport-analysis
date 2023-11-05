FROM node:18

RUN mkdir /frontendtransit

WORKDIR /frontendtransit

COPY package.json /frontendtransit
 
RUN npm install

COPY . /frontendtransit

EXPOSE 3000

CMD ["npm", "start"]