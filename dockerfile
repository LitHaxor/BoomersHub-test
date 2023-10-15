FROM node:19

WORKDIR /app

COPY package.json yarn.lock ./


RUN yarn install

RUN yarn add ts-node -g

COPY . .

RUN npx playwright install chromium

EXPOSE 4000

CMD ["yarn", "start"]

