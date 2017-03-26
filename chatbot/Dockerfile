FROM library/node:slim

COPY botkit /app
WORKDIR /app

RUN apt-get update
RUN apt-get -y install git
RUN cd /app && npm install --production
