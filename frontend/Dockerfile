FROM node:22.8-alpine3.19

WORKDIR /app

EXPOSE 3000

COPY package.json package-lock.json ./

RUN npm install --silent

COPY . ./

CMD [ "npm", "start" ]