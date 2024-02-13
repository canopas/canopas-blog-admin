FROM node:18

WORKDIR /app

# Bundle app source
COPY . .

RUN apt-get update && apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2

RUN mkdir public/uploads

RUN yarn install --frozen-lockfile

ENV NODE_ENV production

RUN cd src/plugins/blog-editor && yarn install && cd ../../..

RUN yarn build

EXPOSE 1337

CMD ["yarn", "start"]