# Lughat Al-Asl (لُغَةُ الْأَصْل)

This project is meant to provide a way to learn the classic arabic language by studying the most important aspects, such as

- nahw
- sarf
- balagha
- ...

The goal is to deliver an efficient way to learn.

## Contributing

If you want to contribute to this project feel free to open a discussion and or a PR. Please bear in mind that this project is developed by individuals during their spare time.

## Project structure

- deployable applications and services should go to the `apps` directory
- shared libraries and reusable code across services should go to the `packages` directory

## Setup

### Doppler

In order for this service to work locally you have to use doppler.

1. Make sure you are signed in to doppler (`doppler login`)
2. Set up the configuration for this service (`doppler setup`)
3. Use the configuration of `authentication-service`

### Docker

This service uses a docker container in order to run. Mongodb is being setup in the [docker-compose.yml](./docker-compose.yml). The needed doppler configuration values are entered via the `environment` in docker. Then to run the service please execute

`doppler run -- docker compose up -d --build`
