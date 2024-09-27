FROM python:3.10
WORKDIR /app
RUN pip install --upgrade pip
# RUN python -m pip install pymongo
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
# Load the environment variables from the mounted .env file
CMD ["gunicorn", "-w", "1", "-b", ":3100", "--timeout", "10000", "app:app"]
