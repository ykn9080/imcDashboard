FROM node:14-alpine AS builder
WORKDIR /app
COPY package.json ./

RUN npm install 
COPY . .
#RUN npm run build
RUN npm run winBuild

FROM nginx:1.19-alpine AS server
COPY --from=builder ./app/build /usr/share/nginx/html