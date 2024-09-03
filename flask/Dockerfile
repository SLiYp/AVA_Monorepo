FROM python:3.8
WORKDIR /app
RUN pip install --upgrade pip
# RUN python -m pip install pymongo
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
# Load the environment variables from the mounted .env file
CMD ["gunicorn", "-w", "4", "-b", "127.0.0.1:3100", "script:app"]
