FROM python:3.3-slim
MAINTAINER Torben Brodt <t.brodt@gmail.com>

COPY . /app
WORKDIR /app

RUN pip3 install Flask-Restless
RUN pip3 install Flask-Sqlalchemy
RUN pip3 install psycopg2

ENTRYPOINT ["python"]
CMD ["app.py"]

