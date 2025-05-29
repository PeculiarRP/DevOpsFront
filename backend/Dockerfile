FROM python:latest
RUN python -m pip install psycopg2
RUN pip show psycopg2
RUN python -m pip install flask
RUN pip show flask
RUN python -m pip install flask_cors
RUN pip show flask_cors
RUN pip install prometheus-flask-exporter
RUN pip show prometheus-flask-exporter 
RUN pip install pytest
RUN pip show pytest
RUN pip install requests
RUN pip show requests

ADD server_rule.py bot_message_service.py /backend/

WORKDIR /backend/
