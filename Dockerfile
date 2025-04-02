FROM node:22 as build
WORKDIR /app

ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package*.json /app/

RUN npm install
RUN npm install -g @angular/cli
RUN npm install --save-dev @angular-devkit/build-angular --force
COPY . /app
RUN ng build --configuration production --deploy-url / --base-href /

FROM nginx
COPY --from=build /app/dist/browser/ /usr/share/nginx/html
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf
