[![Build Status](https://travis-ci.org/uw-it-aca/scout.svg?branch=develop)](https://travis-ci.org/uw-it-aca/scout)  [![Coverage Status](https://coveralls.io/repos/uw-it-aca/scout/badge.svg?branch=master&service=github)](https://coveralls.io/github/uw-it-aca/scout?branch=master)

# Scout

This is the Scout app. It connects to services provided by [spotseeker_server](https://github.com/uw-it-aca/spotseeker_server).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* Docker
* Docker-compose
* git

### Intallation and Set Up

First, clone the repository:

    $ git clone https://github.com/uw-it-aca/scout.git


Navigate to the repository and copy the sample environment variables into your own `.env` file:

```
cd scout
cp sample.env .env
```

Optionally, add custom 404 response to `docker/urls.py`:

```
handler404 = 'scout.views.custom_404_response'
```

## Development

### Running the App with Docker

Run the following command to build your docker container:

```
docker-compose up --build
```

### Running Unit Tests with Docker

```
docker-compose run --rm app bin/python manage.py test
```

### Running the app against a Live Spotseeker Server ###

To find more information on how to run scout against a Live Spotseeker server using the 'all_ok' Auth Module, check [here](https://github.com/uw-it-aca/spotseeker_server/wiki/Using-'all_ok'-oauth-module)


To find more information on how to run scout against a Live Spotseeker server using the 'oauth' Auth Module, check [here](https://github.com/uw-it-aca/spotseeker_server/wiki/Using-OAuth)

## Deployment

(To be completed.)

## Built With

* [Django](http://djangoproject.com/)

## Contributing

Please read [CONTRIBUTING.md] for details on our code of conduct, and the process for submitting pull requests to us. (This has yet to be writtien.)

## Versioning

For the versions available, see the [tags on this repository](https://github.com/uw-it-aca/scout/tags).

## Authors

* [**Academic Experience Design & Delivery**](https://github.com/uw-it-aca)

See also the list of [contributors](https://github.com/uw-it-aca/scout/contributors) who participated in this project.

## License

Copyright 2012-2016 UW Information Technology, University of Washington

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## List of settings

(To be moved to the wiki eventually.)

CAMPUS_URL_LIST
GOOGLE_ANALYTICS_KEY
GOOGLE_MAPS_API
RESTCLIENTS_SPOTSEEKER_DAO_CLASS
RESTCLIENTS_SPOTSEEKER_HOST = ''
SPOTSEEKER_OAUTH_KEY = ''
SPOTSEEKER_OAUTH_SECRET = ''
