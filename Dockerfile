FROM node:14 AS build
# set the working directory, all following commands are run from within this
# newly created directory
WORKDIR /src

RUN mkdir -p /root/.ssh \
 && chmod -R 0600 /root/.ssh \
 && ssh-keyscan github.com > /root/.ssh/known_hosts
 # using github user install all NPM dependencies
RUN --mount=type=ssh,id=github yarn install

COPY . /src
# build the application
RUN npm rebuild node-sass
RUN yarn build:src

# Create the `NGINX` image which is the deployment artifact
FROM nginx:1.15
# remove the default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf
# copy the nginx configuration from the context root
COPY nginx.conf /etc/nginx/conf.d/enclosure.conf
# from the previous `NODE` image copy the built output of the app
COPY --from=build /src/dist /var/www/html/
