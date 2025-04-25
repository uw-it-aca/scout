[![Build Status](https://github.com/uw-it-aca/scout/workflows/Build%2C%20Test%20and%20Deploy/badge.svg?branch=master)](https://github.com/uw-it-aca/scout/actions)
[![Coverage Status](https://coveralls.io/repos/github/uw-it-aca/scout/badge.svg?branch=master)](https://coveralls.io/github/uw-it-aca/scout?branch=master)

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

```bash
git clone https://github.com/uw-it-aca/scout.git
```

If you wish to change the default settings, navigate to the repository and copy the sample environment variables into your own `.env` file:

```bash
cd scout
cp sample.env .env
```

## Development

### Setting up the correct environment variables

Settings `RESTCLIENTS_SPOTSEEKER_DAO_CLASS` to `Mock` will allow you to run the app without connecting to a live Spotseeker server. This is useful for testing and development. However, if you want to properly test the app against a live Spotseeker server, you will need to set up the following environment variables:

```bash
RESTCLIENTS_SPOTSEEKER_DAO_CLASS=Live
RESTCLIENTS_SPOTSEEKER_HOST=[your spotseeker server url]

SPOTSEEKER_OAUTH_CREDENTIAL=[your spotseeker server oauth credential]
```

You must go to your live spotseeker server instance to get the oauth credential. In spotseeker server, run the following command:

```bash
docker exec -ti spotseeker-server bin/python manage.py register_application [-s/--show-credential]
```

You will be prompted for an app name. The default name for this app is `scout`. You can change this name by setting the `APP_NAME` environment variable. The command will give you a credential. Copy and paste this credential into the `SPOTSEEKER_OAUTH_CREDENTIAL` environment variable and you should be good to go.

It is recommended that you keep the scope to read only as that is what scout is designed for.

### Running the App with Docker

Run the following command to build your docker container:

```bash
docker-compose up --build
```

### Running Unit Tests with Docker

```bash
docker exec -ti scout bin/python manage.py test
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

Branch master should be considered the production version. Branch develop is generally what should be used for Pull Requests.

## Authors

* [**Academic Experience Design & Delivery**](https://github.com/uw-it-aca)

See also the list of [contributors](https://github.com/uw-it-aca/scout/contributors) who participated in this project.

## License

Copyright 2012-2023 UW Information Technology, University of Washington

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

GOOGLE_ANALYTICS_KEY

GOOGLE_MAPS_API

COMPRESS_ENABLED

OAUTH_USER

SCOUT_SHOW_ALT_TECH

DEBUG_CACHING
- If set to True, will use a real cache even while in DEBUG=True. This is useful for testing.

RESTCLIENTS_SPOTSEEKER_DAO_CLASS

RESTCLIENTS_SPOTSEEKER_HOST

SPOTSEEKER_OAUTH_CREDENTIAL

SPOTSEEKER_OAUTH_SCOPE

APP_NAME
