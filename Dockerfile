FROM node:16.18.1-alpine
WORKDIR '/app'
COPY ./package.json .
RUN npm install
COPY . .
RUN npm run build
CMD ["npm","run","start"]
