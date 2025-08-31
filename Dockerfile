FROM node:alpine
WORKDIR /app/
COPY ./server/ .
RUN npm i
CMD [ "npm", "start" ]
EXPOSE 3000
