FROM node:20.12.2-alpine

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]

EXPOSE 3000