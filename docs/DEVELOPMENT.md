# Dev env

## Requirements

> If you don't want to use Docker, please read [Use the project without docker](#Use-the-project-without-docker)

- make >= 4.3
- docker >= 24
- docker compose >= 2.21

**macOS**

You can have some performance issues because of docker mounted volumes bad performances.
The issue can easily be solved by mounting a named volume for node_modules, and by installing deps both inside & outside the docker container.
This feature is not part of this repository for now but can be added in a few minutes.

**Windows**

- Clone the repo in LF format by first configuring git with the command `git config core.autocrlf false`.
  If the clone has been made before, run the command `git ls-files -z | xargs -0 dos2unix` to switch to LF format.
- Install [WSL2](https://docs.microsoft.com/en-us/windows/wsl/wsl2-install)
- Enable [Docker support for WSL2](https://docs.docker.com/docker-for-windows/wsl-tech-preview/)
- Install make in WSL: `sudo apt install make`
- Checkout project directly within WSL, as using a native windows directory as a project root will cause massive performance & permissions issues.
    - From cmd or powershell run: `wsl`
    - Run Linux build steps from WSL
- The project **should not** be located under `/mnt/c/`

## Install

### 0. Get the project

```bash
git clone <repository> && cd nest-demo
```

### 1. Configure, install & boot the project

### 1.1 (optional) Customize some options

```bash
make configure
# Update the required files, see bellow
```

If necessary, you can update the following file(s) in order to customize your environment:

- `docker-compose.override.yml`
    - _(optional)_ set a `OPEN_WEATHER_MAP_API_TOKEN` value in order to really do API requests instead of using the
    - _(optional)_ bind some ports to your host

### 1.2 Build & Start everything

```bash
make
```

## Local services

By default, the following services are running after starting the stack (you can configure everything in your `docker-compose.override.yml` file):

(apps)
- API [http://api.localtest.me](http://api.localtest.me)
- API documentation (OpenAPI / Swagger) [http://api.localtest.me/_doc](http://api.localtest.me/_doc)

(tools)
- Traefik (HTTP proxy) [http://traefik.localtest.me](http://traefik.localtest.me)
- PhpMyAdmin (MySQL GUI) [http://phpmyadmin.localtest.me](http://phpmyadmin.localtest.me)

> Tips: you can run `make display-started-services-urls` in order to list all started services
> Tips: if you want to use the stack without internet access (after a first build), add this line in your hosts file: 127.0.0.1 api.localtest.me phpmyadmin.localtest.me

## Usage: stack helpers

```bash
# Build, configure, install, & start everything
# CAUTION: you must have run this command at least once before using other commands
make

# Start the api in background. This command can be used in order to avoid building & installing everything after a first `make`
make start-api
# Start the api and attach the console to it
make start-api-foreground
# Build the prod docker image and start it. This is only for debug purpose
make start-api-prod

# Open a mysql console
make mysql-console
# Open a REPL console
make repl-api

# Run all lint commands
make lint-fix
# Run all tests with coverage
make test

# Install all deps
make vendors

# Generate a new typeorm migration by computing the difference between entities and the current DB
make db-create-new-migration

# List all started services' URLs
make display-started-services-urls
# Display the containers logs
make logs
# Stop everything
make stop
# Stop and clean everything
make down
```

> Go see the [Makefile](Makefile) for all available commands :-)

## Usage: how to run commands

As the stack is dockerized, you can run all your node commands into the running containers.
A convenient `docker/exec` script allows to exec any command in any docker compose container
If you provide a service name (or its first letter) as the first argument, the command will run in the related container:

**Tips**: you can create aliases in your `~/.bashrc` or `~/.zshrc`:

```bash
alias e="docker/exec"
alias ea="docker/exec api"
```

```bash
# Run any command in the API service
docker/exec api npm run test
docker/exec a npm run test
ea npm run test
# Open a shell as the current system's user
docker/exec api
ea

# The tools service allows to run commands in the project's root directory, it's the default option if no service name is provided
docker/exec tools ls -la
docker/exec ls -la
e ls -la
# Open a shell as the current system's user
docker/exec
e

# Open a shell as root in a new dedicated container
docker compose run --rm -u root:root tools sh
```

## How to debug a node app inside WebStorm / PhpStorm

### Debugging the API

- Uncomment the `api: { ports: ['9229:9229'] }` part of you `docker-compose.override.yml` file
- Restart the api with watcher & inspect: `make start-api-foreground`
- Add a new debug configuration in your IDE:
    - Name: `Inspect API`
    - Type: `Attach to Node.js/Chrome`
    - Host: `localhost`
    - Port: `9229`
    - Remote URL: `<path_to_the_project>/api` => `http://localhost:9229`
- Run the debug configuration, and use all the breakpoints you may want

## Use the project without docker

If you prefer to use your host's node command, you can do:

```bash
# 1. Start MySQL if you don't already have one
make start-db

# 2. Go to the api directory and install deps
cd api
npm i

# 3. Run the server with required env vars

# Option 3.1: use node 20's --env-file parameter
node --env-file=.env.docker node_modules/.bin/nest start

# Option 3.2: export all required variables, then run any command
set -o allexport; source .env.docker; set +o allexport
# You can use this command as well on linux: export $(grep -v '^#' .env.docker | xargs -d '\n')
# You can use this command as well on mac & BSD systems: export $(grep -v '^#' .env.docker | xargs -0)
npm run start
```
