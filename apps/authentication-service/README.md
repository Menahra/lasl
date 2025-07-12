# Authentication Service

This service is the authentication service for the lasl project. It is based internally on a mongodb.

## Setup

### Doppler

In order for this service to work locally you have to use doppler.

1. Make sure you are signed in to doppler (`doppler login`)
2. Set up the configuration for this service (`doppler setup`)
3. Use the configuration of `authentication-service`

### Docker

This service uses a docker container in order to run. Mongodb is being setup in the [docker-compose.yml](./docker-compose.yml). The needed doppler configuration values are entered via the `environment` in docker. Then to run the service please execute `doppler run -- docker compose up --build`
