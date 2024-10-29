FROM python:3.10.11

WORKDIR /app

EXPOSE 5051

COPY Pipfile ./
COPY Pipfile.lock ./

RUN pip install pipenv
RUN pipenv requirements > requirements.txt
RUN pip install -r requirements.txt

COPY . ./

CMD [ "python", "main.py" ]