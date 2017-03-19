# Lunchbot for Slack
This Lunchbot includes a docker compose file using
- Flask-Restless + Flask-Sqlalchemy
- Postgres

The actual chatbot is missing so far. It will be created using botkit as part of a Hackthon taking place beginning of June.

## build it
```bash
docker-compose build
```

## run it
```bash
docker-compose up
```

# Once Running it can be used on port 5000

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
