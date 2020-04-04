FROM node:13.12.0-alpine3.11
EXPOSE 8080
COPY ./ /app/
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org
ENTRYPOINT [ "npm", "start" ]