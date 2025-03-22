FROM python:latest
RUN python -m pip install psycopg2
RUN pip show psycopg2
RUN python -m pip install flask
RUN pip show flask
RUN python -m pip install flask_cors
RUN pip show flask_cors

ADD server_rule.py /backand/

WORKDIR /backand/