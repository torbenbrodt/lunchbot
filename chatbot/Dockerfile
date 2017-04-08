FROM library/node:alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY ./botkit/package.json /usr/src/app/
#RUN npm install request --save
RUN npm install --production

# Bundle app source
COPY ./botkit /usr/src/app

