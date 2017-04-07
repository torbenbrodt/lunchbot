# Lunchbot for Slack
The Lunchbot can be used to register for Lunches, ask for reservation status and more.

It includes a docker compose file using Flask-Restless + Flask-Sqlalchemy + Postgres.
This project includes a HTTP API for CRUD operations. The database is described in [flask/app.py](flask/app.py)

You can browse the api by calling [http://127.0.0.1:5000/api/lunch](http://127.0.0.1:5000/api/lunch) in your browser.

The actual chatbot will be created during the Hackathon "[Create your own chatbot! by plista](https://www.meetup.com/plistatecheventsberlin/events/238379390/)" taking place in June.

## Install requirements and Get the code
To install Docker see instructions at https://docs.docker.com/engine/installation/. I used the simple command ```curl -sSL https://get.docker.com/ | sh```

To install Docker Compose see instructions at https://docs.docker.com/compose/install/

Then get the code
```bash
git clone --recursive https://github.com/torbenbrodt/lunchbot
```

## Get slack token
Your bot connects via a simple slack-token to the corresponding slack-team.
For sake of simplicity the workshop organizers can provide you with token for the hackathon slack-team [http://lunchbot-hackathon.slack.com](#lunchbot-hackathon.slack.com).

Of course you can also use your personal slack channel. In this case get a Bot token from: http://my.slack.com/services/new/bot
Afterwards update your docker compose environment
```bash
echo "token=xxxx-xxxxxxxxx-xxxx" > .env
```

## Develop, Improve and Run the lunchbot
Start flask and postgres via.
```bash
docker-compose up flask some-postgres
```
Your code lives in [chatbot/chatbot.js](chatbot/chatbot.js). Here the actual work happens.
To run it please execute
```bash
docker-compose up botkit
```

### Debugging in bash
Sometimes docker-composer is just to generic and you want to execute commands on your own.
```bash
docker run -p 8888:8888 -it --rm --name my-running-app -v "$PWD/chatbot/chatbot.js":/app/chatbot.js -w /app --env-file .env lunchbot_botkit /bin/bash
```

# API Examples
The following examples show you how to work with it using your command line.

## create a lunch
```bash
curl -H "Content-Type: application/json" -X POST -d '{
  "chef": "Bob", 
  "date": "2017-04-01 12:30:00", 
  "is_meat": "True", 
  "is_vegan": "False", 
  "is_vegetarian": "False",
  "text": "Today its Salami", 
  "title": "Lunch with Bob"
}' http://127.0.0.1:5000/api/lunch
```

## create a registration
```bash
curl -H "Content-Type: application/json" -X POST -d '{
  "username": "peter",
  "lunch_id": 1
}' http://127.0.0.1:5000/api/registration
```
