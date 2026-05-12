COMPOSE ?= docker compose

.PHONY: up down build rebuild logs ps backend frontend db

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

build:
	$(COMPOSE) build

rebuild:
	$(COMPOSE) up -d --build

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

backend:
	$(COMPOSE) up -d --build backend

frontend:
	$(COMPOSE) up -d --build frontend

db:
	$(COMPOSE) up -d db

test-e2e:
	$(COMPOSE) up -d --build
	@echo "Waiting for services to be ready..."
	@until curl -sk https://localhost:3000 > /dev/null; do sleep 2; done
	@until curl -s http://localhost:8080/api/v1/auth/login > /dev/null; do sleep 2; done
	cd frontend && npm install && npm run cypress:run
	$(COMPOSE) down
