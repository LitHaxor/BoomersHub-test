FROM node:19

WORKDIR /app

COPY package.json yarn.lock ./


RUN yarn install


COPY . .

RUN yarn add ts-node -g


RUN npx playwright install chromium

EXPOSE 4000

CMD ["yarn", "start"]

