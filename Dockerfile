FROM node:18 AS ui-build
WORKDIR /app
COPY . ./
RUN yarn install --frozen-lockfile && yarn build

FROM node:18 AS server-build
WORKDIR /root/
COPY --from=ui-build /app/.next ./.next
COPY --from=ui-build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["yarn", "start"]
