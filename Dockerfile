FROM node:18-alpine as builder

COPY package.json yarn.lock ./
COPY package.json ./
COPY yarn.lock ./

RUN yarn
RUN mkdir /HA-Dashboard
RUN mv ./node_modules ./HA-Dashboard

WORKDIR /HA-Dashboard

COPY . .

RUN yarn build


FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /HA-Dashboard/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
