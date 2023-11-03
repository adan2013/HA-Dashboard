FROM node:18-alpine as builder

ARG VITE_HA_HOST
ARG VITE_HA_TOKEN
ARG VITE_BACKEND_HOST

ENV VITE_HA_HOST=$VITE_HA_HOST
ENV VITE_HA_TOKEN=$VITE_HA_TOKEN
ENV VITE_BACKEND_HOST=$VITE_BACKEND_HOST

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

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /HA-Dashboard/dist /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
