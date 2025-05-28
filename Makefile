include srcs/.env

all: up

up: secrets
	@mkdir -p ~/data/wordpress ~/data/mariadb
	docker compose -f srcs/docker-compose.yml up --build #--detach

build:
	docker compose -f srcs/docker-compose.yml build --no-cache

down:
	docker compose -f srcs/docker-compose.yml down

start:
	docker compose -f srcs/docker-compose.yml start

stop:
	docker compose -f srcs/docker-compose.yml stop

logs:
	docker compose -f srcs/docker-compose.yml logs --follow

prune:
	docker system prune --all --volumes --force

clean:
	docker compose -f srcs/docker-compose.yml down --volumes --rmi all

fclean: clean
#	Use docker run to remove data because of permissions
	docker run -it --rm -v $(HOME)/data:/data busybox sh -c "rm -rf /data/*"
	rm -rf ./secrets/

re: fclean up


secrets:
	@echo "📦 Génération des secrets dans $(SECRETS_DIR)..."
	@mkdir -p $(SECRETS_DIR)
	openssl rand -hex 32 > $(SECRETS_DIR)/gateway_jwt_secret
	openssl rand -hex 32 > $(SECRETS_DIR)/auth_jwt_secret
	openssl rand -hex 32 > $(SECRETS_DIR)/matchmaking_secret
	openssl rand -hex 32 > $(SECRETS_DIR)/vault_root_token
	# Pour Google Sign-In : à remplir manuellement après
	touch $(SECRETS_DIR)/google_client_id
	touch $(SECRETS_DIR)/google_client_secret
	# Certificat SSL auto-signé
	openssl req -x509 -newkey rsa:2048 -keyout $(SECRETS_DIR)/ssl_certificate_key \
		-out $(SECRETS_DIR)/ssl_certificate -days 365 -nodes \
		-subj "/CN=$(DOMAIN_NAME)" 2> /dev/null
	@echo "✅ Secrets générés avec succès."

help:
	@echo "Makefile for Docker Compose"
	@echo "Available targets:"
	@echo "  up      - Start services"
	@echo "  build   - Build services"
	@echo "  down    - Remove services"
	@echo "  start   - Start services"
	@echo "  stop    - Stop services"
	@echo "  logs    - View logs"
	@echo "  prune   - Remove all unused containers and images"
	@echo "  re      - Restart services with fclean & up"
	@echo "  fclean  - Call clean and remove data, secrets & certificates"
	@echo "  clean   - Remove volumes and stop services"
	@echo "  help    - Show this help message"

.PHONY: all up build down start stop logs prune mysql re fclean clean secrets