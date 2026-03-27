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
