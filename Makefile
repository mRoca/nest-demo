DOCKER_COMPOSE_ALL_PROFILES=COMPOSE_PROFILES=default,tools,manual docker compose

all: pre-configure configure pull-build vendors start-api

pre-configure:
	@echo "Checking docker"         && command -v "docker" > /dev/null 2>&1    || (echo "You must install the 'docker' command" && false)
	@echo "Checking docker compose" && docker compose version > /dev/null 2>&1 || (echo "You must install the 'docker compose' command" && false)

configure:
	mkdir -p .cache/npm
ifeq (,$(wildcard .env))
	cp .env.dist .env
ifeq ($(shell uname -s), Darwin)
	grep -vq "COMPOSE_VOLUME_FLAG=:delegated" .env && sed -i '' 's/COMPOSE_VOLUME_FLAG=/COMPOSE_VOLUME_FLAG=:delegated/' .env
	# Permissions are already well managed on MacOS
	sed -i '' "s/\$$UID/0/g" .env; sed -i '' "s/\$$GID/0/g" .env
else
	sed -i "s/\$$UID/$(shell id -u)/g" .env; sed -i "s/\$$GID/$(shell id -g)/g" .env
endif
endif
ifeq (,$(wildcard docker-compose.override.yml))
	cp docker-compose.override.yml.dist docker-compose.override.yml
endif

unconfigure:
	@# Removing everything as root, in order to avoid permissions issues. Thanks docker ;-)
	-docker run --rm -v `pwd`:/srv -w /srv alpine:latest rm -rf .cache .env docker-compose.override.yml

clear-cache:
	@# Removing the .cache folder as root, in order to avoid permissions issues
	-docker run --rm -v `pwd`:/srv -w /srv alpine:latest rm -rf .cache
	git clean -dxf --exclude="node_modules" --exclude=".env" api
	@# re-create the required directories in order to allow running start-* commands just after
	$(MAKE) --no-print-directory configure

down:
	-$(DOCKER_COMPOSE_ALL_PROFILES) down -v --remove-orphans
	-$(MAKE) --no-print-directory clear-cache
	@echo "\n=> Done, you can run 'make unconfigure' if you want to remove the remaining files: .env docker-compose.override.yml"

pull-build:
	docker compose pull
	docker compose --profile cli build --pull

vendors:
	docker compose run --rm api npm install --no-save

start-tools:
	docker compose up --no-recreate -d traefik phpmyadmin

start-db:
	docker compose up --no-recreate -d mysql
	docker compose run --rm wait -c mysql:3306 -t 60

start-tools-and-db-if-not-running:
	@test -n "$(shell docker compose ps -q --status running mysql 2> /dev/null)" || $(MAKE) --no-print-directory start-db
	@test -n "$(shell docker compose ps -q --status running traefik 2> /dev/null)" || $(MAKE) --no-print-directory start-tools

start-api: start-tools-and-db-if-not-running
	docker compose up -d api
	docker compose run --rm wait -c api:3000 -t 20
	@$(MAKE) --no-print-directory display-started-services-urls

start-api-foreground: start-tools-and-db-if-not-running
	docker compose up --force-recreate api

stop:
	$(DOCKER_COMPOSE_ALL_PROFILES) stop

logs:
	docker compose logs -f --tail 20 api localstack

display-started-services-urls:
	@echo "\n> Started web services (if you get a 404, just wait a few seconds and retry):\n"
	sleep 3
	@docker/exec sh -c "curl -s traefik.localtest.me/api/http/routers | jq -r '. | map(select(.rule | test(\".localtest.me\")))[] | .rule |= gsub(\"(Host\\\\()?\`(?<url>[^\`]+)\`[,)]?\"; \"http://\(.url)\") | .rule'"

# This step allows to build & run the "prod" image
start-api-prod: start-tools-and-db-if-not-running
	docker compose up -d --build --force-recreate api_prod
	@$(MAKE) --no-print-directory display-started-services-urls
	docker compose logs -f api_prod

# Helpers
mysql-console: start-tools-and-db-if-not-running
	docker/exec mysql sh -c 'mysql -u root -p"$$MYSQL_ROOT_PASSWORD" "$$MYSQL_DATABASE"'

repl-api: start-tools-and-db-if-not-running
	# See https://docs.nestjs.com/recipes/repl
	docker/exec api npm run start -- --watch --preserveWatchOutput --entryFile repl

lint-fix:
	docker/exec api npm run lint:fix

test: start-tools-and-db-if-not-running
	docker/exec api npm run lint
	docker/exec api npm run test:cov
	@echo "Done, you can see the coverage report there: $(shell pwd)/api/.coverage/index.html"

create-new-migration: start-tools-and-db-if-not-running
	@echo "Migration name: "; read FILE_NAME; docker/exec api npm run typeorm migration:generate "src/app/database/migrations/$${FILE_NAME}"
