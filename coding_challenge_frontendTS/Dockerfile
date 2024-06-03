FROM node:20-alpine

COPY . /app/
WORKDIR /app

RUN npm install
EXPOSE 5173
CMD [ "npm", "run", "dev" ]
