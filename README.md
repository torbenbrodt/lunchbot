# Lunchbot for Slack
The Lunchbot can be used to register for Lunches, ask for reservation status and more.

It includes a docker compose file using Flask-Restless + Flask-Sqlalchemy + Postgres.
This project includes a HTTP API for CRUD operations. The database is described in [flask/app.py](flask/app.py)

You can browse the api by calling [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser.

The actual chatbot will be created during the Hackathon "[Create your own chatbot! by plista](https://www.meetup.com/plistatecheventsberlin/events/238379390/)" taking place in June.

## Install requirements and Get the code
To install Docker see instructions at https://docs.docker.com/engine/installation/. I used the simple command ```curl -sSL https://get.docker.com/ | sh```

To install Docker Compose see instructions at https://docs.docker.com/compose/install/

Then get the code
```bash
git clone --recursive https://github.com/torbenbrodt/lunchbot
```

## Get slack token
Get a Bot token from your Slack: http://my.slack.com/services/new/bot
Afterwards update your docker compose environment
```bash
echo "slack_token=xxxx-xxxxxxxxx-xxxx" > .env
```

## Develop, Improve and Run the lunchbot
Your code should live in [chatbot/chatbot.js](chatbot/chatbot.js)
```bash
docker-compose up
```

### Debugging
Sometimes docker-composer is just to generic and you want to execute commands on your own.
```bash
docker run -p 8888:8888 -it --rm --name my-running-app -v "$PWD/chatbot/botkit":/usr/src/app -w /usr/src/app -e "token=yourtoken" lunchbot_botkit npm install --production
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
