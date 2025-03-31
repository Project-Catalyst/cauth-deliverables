# Build stage
FROM node:20-alpine AS build-stage

WORKDIR /app

#Install quasar cli
RUN npm install -g @quasar/cli
# Copy package and config files
COPY package*.json ./
COPY quasar.config.js ./
# Install dependencies
RUN npm install
# Copy project files
COPY . .
# Build the app
RUN quasar build

FROM nginx:alpine AS production-stage
#Copy build
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
