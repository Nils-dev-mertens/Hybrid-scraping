FROM node:alpine
WORKDIR /app/
COPY ./server/ .
RUN npm i
RUN npm run build
CMD [ "npm","run","start"]
EXPOSE 3000