FROM python:3.6
ENV PYTHONUNBUFFERED 1

# copy contents of repo into an 'app' directory on container
ADD . /app
WORKDIR /app

# install python dependency packages (via setup.py) on container
RUN pip install -r requirements.txt

# move manage.py out of sampleproj to root directory so that django can start
COPY sampleproj/manage.py /app/manage.py
