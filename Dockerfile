FROM node:latest

WORKDIR /GARDA-APP

COPY package*.json ./

COPY . ./

RUN npm install

RUN npm run build

EXPOSE 3000

CMD npx serve build -l 3000