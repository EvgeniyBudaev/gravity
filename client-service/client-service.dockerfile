FROM node:20.11.1-alpine

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

RUN npm run build

COPY .next ./.next

CMD ["npm", "run", "start"]

EXPOSE 3000