FROM node:18

WORKDIR /app

# Bundle app source
COPY . .

RUN mkdir public/uploads

RUN yarn install --frozen-lockfile

ENV NODE_ENV production

RUN cd src/plugins/blog-editor

RUN yarn install

RUN cd ../../..

RUN yarn build

EXPOSE 1337

CMD ["yarn", "start"]