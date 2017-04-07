FROM library/node:slim

COPY botkit /app
WORKDIR /app

RUN apt-get update
RUN apt-get -y install git
RUN cd /app
#RUN npm install request --save
RUN npm install --production
#RUN grep request package.json
